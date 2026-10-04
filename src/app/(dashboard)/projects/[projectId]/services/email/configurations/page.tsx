"use client";

import AddEmailDomainForm from "@/components/forms/AddEmailDomainForm";
import AddEmailSenderForm, {
  type AddEmailSenderFormValues,
} from "@/components/forms/AddEmailSenderForm";
import {
  UserType,
  useUserSession,
} from "@/components/providers/SessionProvider";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProjectById } from "@/lib/project";
import {
  registerJunoDomain,
  registerJunoSenderAddress,
  verifyJunoDomain,
  type DomainActionResult,
  type DomainRegistration,
  type SenderAddressInput,
} from "@/lib/sdkUtils";
import { getEmailConfig } from "@/lib/settings";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ProjectResponse } from "juno-sdk/build/main/internal/index";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const EmailSendersAndDomainsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useUserSession();
  const isAdmin = !!user && user.type !== UserType.USER;

  const [domainResult, setDomainResult] = useState<DomainRegistration | null>(
    null,
  );
  // Bumped after a sender is registered so the form remounts with empty fields.
  const [senderFormKey, setSenderFormKey] = useState(0);

  const { isLoading: projectLoading, data: project } =
    useQuery<ProjectResponse>({
      queryKey: ["project", projectId],
      queryFn: async () => {
        const result = await getProjectById(Number(projectId));
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.project;
      },
    });

  const {
    data: emailConfig,
    isLoading: emailConfigLoading,
    isError: emailConfigError,
  } = useQuery({
    queryKey: ["emailConfig", projectId],
    queryFn: () => getEmailConfig(projectId),
    enabled: !!projectId,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const registerSender = useMutation({
    mutationFn: (values: AddEmailSenderFormValues) =>
      // The zod schema guarantees the required fields; zod infers every key as
      // optional when tsconfig `strict` is off.
      registerJunoSenderAddress(projectId, values as SenderAddressInput),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Sender registered", { description: res.message });
        setSenderFormKey((key) => key + 1);
      } else {
        toast.error("Error", { description: res.message });
      }
    },
    onError: (e) => {
      toast.error("Error", { description: `${e}` });
    },
  });

  // Never leave one domain's DNS records on screen while working on another.
  const clearRecordsForOtherDomain = (domain: string) => {
    if (
      domainResult &&
      domainResult.domain.toLowerCase() !== domain.trim().toLowerCase()
    ) {
      setDomainResult(null);
    }
  };

  const handleDomainResult = (res: DomainActionResult) => {
    if (!res.success) {
      toast.error("Error", { description: res.message });
      return;
    }
    if (res.domain) {
      setDomainResult(res.domain);
    }
    if (res.domain?.valid) {
      toast.success("Domain verified", { description: res.message });
    } else {
      toast.info(res.message);
    }
  };

  const registerDomain = useMutation({
    mutationFn: ({
      domain,
      subdomain,
    }: {
      domain: string;
      subdomain?: string;
    }) => registerJunoDomain(projectId, domain, subdomain),
    onMutate: ({ domain }) => clearRecordsForOtherDomain(domain),
    onSuccess: handleDomainResult,
    onError: (e) => {
      toast.error("Error", { description: `${e}` });
    },
  });

  const verifyDomain = useMutation({
    mutationFn: (domain: string) => verifyJunoDomain(projectId, domain),
    onMutate: (domain) => clearRecordsForOtherDomain(domain),
    onSuccess: handleDomainResult,
    onError: (e) => {
      toast.error("Error", { description: `${e}` });
    },
  });

  const dnsRows = domainResult
    ? [
        { label: "Mail CNAME", record: domainResult.records.mailCname },
        { label: "DKIM 1", record: domainResult.records.dkim1 },
        { label: "DKIM 2", record: domainResult.records.dkim2 },
      ]
    : [];

  const renderBody = () => {
    if (emailConfigLoading) {
      return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Admins Only</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Only admins and superadmins can register senders and domains.
            </p>
          </CardContent>
        </Card>
      );
    }

    if (emailConfigError) {
      return (
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Couldn&apos;t Load Email Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Something went wrong while checking this project&apos;s email
              setup. Reload the page to try again.
            </p>
          </CardContent>
        </Card>
      );
    }

    if (emailConfig === null) {
      return (
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Email Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Add your SendGrid key in settings before registering senders and
              domains.
            </p>
            <Button asChild>
              <Link href={`/projects/${projectId}/settings`}>
                Go to Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Register a Sender</CardTitle>
              <CardDescription>
                A from-address, like noreply@example.com, that is allowed to
                send email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddEmailSenderForm
                key={senderFormKey}
                projectId={Number(projectId)}
                isPending={registerSender.isPending}
                onAddSender={(values) => registerSender.mutate(values)}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Register a Domain</CardTitle>
              <CardDescription>
                Proves you own the domain emails are sent from. Already
                registered? Enter the domain and click Verify to see its status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddEmailDomainForm
                projectId={Number(projectId)}
                isRegistering={registerDomain.isPending}
                isVerifying={verifyDomain.isPending}
                onRegister={(domain, subdomain) =>
                  registerDomain.mutate({ domain, subdomain })
                }
                onVerify={(domain) => verifyDomain.mutate(domain)}
              />
            </CardContent>
          </Card>
        </div>

        {domainResult && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>DNS Records for {domainResult.domain}</CardTitle>
                <Badge variant={domainResult.valid ? "default" : "secondary"}>
                  {domainResult.valid ? "Verified" : "Not verified"}
                </Badge>
              </div>
              <CardDescription>
                Add these records at your DNS provider, then click Verify
                Domain. DNS changes can take a while to propagate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dnsRows.map(({ label, record }) => (
                    <TableRow key={label}>
                      <TableCell>{label}</TableCell>
                      <TableCell className="uppercase">{record.type}</TableCell>
                      <TableCell className="break-all font-mono text-xs">
                        {record.host}
                      </TableCell>
                      <TableCell className="break-all font-mono text-xs">
                        {record.data}
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.valid ? "default" : "secondary"}>
                          {record.valid ? "Valid" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${projectId}`}>
              {projectLoading ? "****" : (project?.name ?? "Unknown")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${projectId}/services/email`}>
              Email
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Senders &amp; Domains</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Separator className="mb-8" />
      <h1 className="mb-4 text-lg font-bold">Email Senders &amp; Domains</h1>
      {renderBody()}
    </div>
  );
};

export default EmailSendersAndDomainsPage;
