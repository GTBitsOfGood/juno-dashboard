"use client";

import {
  EmailDomainColumn,
  emailDomainColumns,
} from "@/components/emailDomainTable/columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getEmailDomains } from "@/lib/settings";
import { registerJunoDomain } from "@/lib/sdkUtils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BaseTable } from "../baseTable";
import AddEmailDomainForm from "../forms/AddEmailDomainForm";
import { DialogHeader } from "../ui/dialog";

interface EmailDomainTableProps {
  projectId: string;
}

export function EmailDomainTable({ projectId }: EmailDomainTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    data: domainsResult,
    error,
  } = useQuery({
    queryKey: ["emailDomains", projectId],
    queryFn: async () => {
      return await getEmailDomains(projectId);
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error("Error", {
        description: `Failed to fetch email domains: ${JSON.stringify(error)}`,
      });
    }
    if (domainsResult && !domainsResult.success && domainsResult.error) {
      toast.error("Error", {
        description: domainsResult.error,
      });
    }
  }, [isError, error, domainsResult]);

  const domainRowData: EmailDomainColumn[] = (
    domainsResult?.domains ?? []
  ).map((domain: EmailDomainColumn) => ({
    id: domain.id,
    domain: domain.domain ?? "",
    subdomain: domain.subdomain,
    valid: domain.valid ?? false,
  }));

  const addDomainHandler = useMutation({
    mutationFn: async (options: {
      domain: string;
      subdomain?: string;
    }) => {
      const result = await registerJunoDomain(
        options.domain,
        options.subdomain,
      );
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Success", {
        description: "Successfully registered domain.",
      });
      queryClient.invalidateQueries({
        queryKey: ["emailDomains", projectId],
      });
    },
    onSettled: () => {
      setIsAddDialogOpen(false);
    },
    onError: (error) =>
      toast.error(
        `An error occurred while registering domain: ${error.message}`,
      ),
  });

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Email Domain</DialogTitle>
            <DialogDescription>
              Register a new domain with SendGrid for email authentication
            </DialogDescription>
          </DialogHeader>
          <AddEmailDomainForm
            isPending={addDomainHandler.isPending}
            onAddDomain={(options) => addDomainHandler.mutate(options)}
          />
        </DialogContent>
      </Dialog>

      <h1 className="text-lg font-bold">Email Domains</h1>
      <BaseTable
        data={domainRowData}
        columns={emailDomainColumns}
        isLoading={isLoading}
        filterParams={{
          placeholder: "Filter by domain...",
          filterColumn: "domain",
        }}
        onAddNewRow={() => {
          setIsAddDialogOpen(true);
        }}
      />
    </div>
  );
}
