"use client";

import { BaseTable } from "@/components/baseTable";
import { columns as emailConfigColumns } from "@/components/emailConfigTable/columns";
import { columns as fileConfigColumns } from "@/components/fileConfigTable/columns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getProjectById } from "@/lib/project";
import { getEmailConfig, getFileConfig } from "@/lib/settings";
import {
  EmailConfigResponse,
  FileConfigResponse,
  ProjectResponse,
} from "juno-sdk/build/main/internal/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProjectSettingsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState<ProjectResponse>(undefined);
  const [fileConfig, setFileConfig] = useState<FileConfigResponse>(undefined);
  const [emailConfig, setEmailConfig] =
    useState<EmailConfigResponse>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fileConfigResult, emailConfigResult, projectResult] =
          await Promise.all([
            getFileConfig(projectId),
            getEmailConfig(projectId),
            getProjectById(Number(projectId)),
          ]);

        if (fileConfigResult.success) {
          setFileConfig(fileConfigResult.fileConfig);
        } else {
          toast.error("Error", {
            description: `Failed to fetch file configs: ${fileConfigResult.error}`,
          });
        }

        if (emailConfigResult.success) {
          setEmailConfig(emailConfigResult.emailConfig);
        } else {
          toast.error("Error", {
            description: `Failed to fetch email config: ${emailConfigResult.error}`,
          });
        }

        if (projectResult.success) {
          setProjectData(projectResult.project);
        } else {
          toast.error("Error", {
            description: `Failed to fetch project: ${projectResult.error}`,
          });
        }
      } catch (error) {
        toast.error("Error", {
          description: `Error fetching data: ${error}`,
        });
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId && !isNaN(Number(projectId))) {
      fetchData();
    }
  }, [projectId]);

  return (
    <div className="container mx-auto px-10 py-10">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${projectId}`}>
              {projectData?.name ?? "**Loading**"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4">
        <h1>File Configurations</h1>
        <BaseTable
          data={
            fileConfig
              ? [fileConfig].map((config) => ({
                  bucketNames: config.buckets?.map((bucket) => bucket.name),
                  id: config.id.low,
                  environment: config.environment,
                }))
              : []
          }
          columns={fileConfigColumns}
          isLoading={loading}
        />
        <h1>Email Configurations</h1>
        <BaseTable
          data={
            emailConfig
              ? [emailConfig].map((config) => ({
                  id: config.id.low,
                  environment: config.environment,
                  sendgridKey: config.sendgridKey,
                  domainNames: config.domains?.map((domain) => domain.domain),
                  senderUsernames: config.senders?.map(
                    (sender) => sender.username
                  ),
                }))
              : []
          }
          columns={emailConfigColumns}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default ProjectSettingsPage;
