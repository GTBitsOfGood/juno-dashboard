"use client";

import { EmailDomainTable } from "@/components/emailDomainTable/emailDomainTable";
import { EmailSenderTable } from "@/components/emailSenderTable/emailSenderTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getProjectById } from "@/lib/project";
import { getEmailConfig } from "@/lib/settings";
import { useQuery } from "@tanstack/react-query";
import { ProjectResponse } from "juno-sdk/build/main/internal/index";
import { Mail, Settings } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EmailConfigurationsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [hasEmailConfig, setHasEmailConfig] = useState(null);
  const [emailConfigLoading, setEmailConfigLoading] = useState(true);

  const {
    isLoading,
    isError,
    data: project,
    error,
  } = useQuery<ProjectResponse>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const result = await getProjectById(Number(projectId));
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.project;
    },
  });

  if (isError) {
    toast.error("Error", {
      description: `Failed to fetch project: ${JSON.stringify(error)}`,
    });
  }

  useEffect(() => {
    const loadEmailConfig = async () => {
      try {
        const configRes = await getEmailConfig(String(projectId));
        if (configRes) {
          setHasEmailConfig(configRes);
        }
      } catch (e) {
        console.error("Error loading email config:", e);
        toast.error("Error loading email config", {
          description: "Please try again later",
        });
      } finally {
        setEmailConfigLoading(false);
      }
    };

    loadEmailConfig();
  }, [projectId]);

  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/projects/${projectId}`}>
            {isLoading ? "****" : (project?.name ?? "Unknown")}
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
          <BreadcrumbPage>Configurations</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  if (emailConfigLoading) {
    return (
      <div className="flex flex-col">
        {breadcrumb}
        <Separator className="mb-8" />
        <h1 className="mb-4 text-lg font-bold">Email Configurations</h1>
        <div className="space-y-4">
          <div className="h-64 animate-pulse rounded-md bg-muted" />
          <div className="h-64 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    );
  }

  if (!hasEmailConfig) {
    return (
      <div className="flex flex-col">
        {breadcrumb}
        <Separator className="mb-8" />
        <h1 className="mb-4 text-lg font-bold">Email Configurations</h1>
        <Card className="max-w-[35%]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <CardTitle>No Email Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure your email service first to manage senders and domains.
            </p>
            <Button asChild>
              <Link href={`/projects/${projectId}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Go to Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {breadcrumb}
      <Separator className="mb-8" />
      <div className="flex flex-col gap-8">
        <EmailSenderTable projectId={projectId} />
        <EmailDomainTable projectId={projectId} />
      </div>
    </div>
  );
};

export default EmailConfigurationsPage;
