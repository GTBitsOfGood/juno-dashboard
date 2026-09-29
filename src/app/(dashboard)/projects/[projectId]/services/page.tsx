"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAnalyticsConfig,
  getEmailConfig,
  getFileConfig,
} from "@/lib/settings";
import { getAllFileProviders } from "@/lib/fileProvider";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getApiKeysAction } from "@/lib/actions";
import {
  UserType,
  useUserSession,
} from "@/components/providers/SessionProvider";

const ServicesPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useUserSession();
  const isAdmin = user && user.type !== UserType.USER;

  const { data: emailConfig, isLoading: emailLoading } = useQuery({
    queryKey: ["emailConfig", projectId],
    queryFn: () => getEmailConfig(projectId),
    enabled: !!projectId,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const { data: fileConfig, isLoading: fileConfigLoading } = useQuery({
    queryKey: ["fileConfig", projectId],
    queryFn: () => getFileConfig(projectId),
    enabled: !!projectId,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const { data: analyticsConfig, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analyticsConfig", projectId],
    queryFn: () => getAnalyticsConfig(projectId),
    enabled: !!projectId,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const { data: providers, isLoading: providersLoading } = useQuery({
    queryKey: ["fileProvider", projectId],
    queryFn: () => getAllFileProviders(projectId),
    enabled: !!projectId && !!fileConfig,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const { data: apiKeyData, isLoading: apiKeysLoading } = useQuery({
    queryKey: ["apiKeyCount", projectId],
    queryFn: async () => {
      const limit = 100;
      let offset = 0;
      let count = 0;

      while (true) {
        const result = await getApiKeysAction({
          offset,
          limit,
        });

        if (!result.success) {
          return { count: null, error: result.error };
        }

        const keys = result.keys ?? [];

        count += keys.filter(
          (key) => String(key.project) === String(projectId),
        ).length;

        if (keys.length < limit) {
          break;
        }

        offset += limit;
      }

      return { count, error: null };
    },
    enabled: !!projectId && isAdmin,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const apiKeyCount = apiKeyData?.count ?? null;
  const apiKeyAccessDenied = !isAdmin || apiKeyData?.error != null;

  const isEmailConfigured = emailConfig !== null;
  const isFileConfigured = fileConfig !== null;
  const isAnalyticsConfigured = analyticsConfig !== null;

  const hasProvider = (providers?.length ?? 0) > 0;
  const hasBucket = (fileConfig?.buckets?.length ?? 0) > 0;
  const hasFiles = (fileConfig?.files?.length ?? 0) > 0;

  const services = [
    {
      name: "Email",
      configured: isEmailConfigured,
      loading: emailLoading,
      description:
        "Configure email to send messages and notifications from your project.",
      href: `/projects/${projectId}/services/email`,
    },
    {
      name: "Files",
      configured: isFileConfigured,
      loading: fileConfigLoading,
      description:
        "Configure file storage and manage buckets and uploaded files.",
      href: `/projects/${projectId}/services/files`,
    },
    {
      name: "Analytics",
      configured: isAnalyticsConfigured,
      loading: analyticsLoading,
      description:
        "Configure analytics to track user interactions, visits, clicks, and custom events.",
      href: `/projects/${projectId}/analytics`,
    },
    {
      name: "API Keys",
      configured: null,
      loading: false,
      description:
        "Create and manage API keys used to authenticate your project.",
      href: `/projects/${projectId}/keys`,
      adminOnly: true,
    },
  ];

  return (
    <div>
      <h1 className="mb-4 text-lg font-bold">Services</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        {services.map((service) => (
          <Link key={service.name} href={service.href} className="block">
            <Card className="flex flex-col h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{service.name}</CardTitle>
                  {service.adminOnly ? (
                    isAdmin ? null : (
                      <Badge variant="outline">Admins only</Badge>
                    )
                  ) : (
                    <Badge
                      variant={
                        service.loading
                          ? "secondary"
                          : service.configured
                            ? "default"
                            : "secondary"
                      }
                    >
                      {service.loading
                        ? "Checking..."
                        : service.configured
                          ? "Configured"
                          : "Not configured"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <p className="mb-4 text-sm text-muted-foreground">
                  {service.description}
                </p>
                {service.name === "API Keys" && isAdmin && (
                  <div className="mb-4 text-sm text-muted-foreground">
                    Number of API Keys:{" "}
                    <span className="text-foreground">
                      {apiKeysLoading
                        ? "Checking..."
                        : apiKeyAccessDenied
                          ? "—"
                          : `${apiKeyCount ?? 0}`}
                    </span>
                  </div>
                )}
                {service.name === "Files" &&
                isFileConfigured &&
                !fileConfigLoading ? (
                  <div className="mb-4 space-y-1 text-sm text-muted-foreground">
                    <div>
                      Provider:{" "}
                      <span className="text-foreground">
                        {providersLoading
                          ? "Checking..."
                          : hasProvider
                            ? "Configured"
                            : "Not configured"}
                      </span>
                    </div>
                    <div>
                      Buckets:{" "}
                      <span className="text-foreground">
                        {fileConfigLoading
                          ? "Checking..."
                          : hasBucket
                            ? "Available"
                            : "None"}
                      </span>
                    </div>
                    <div>
                      Files:{" "}
                      <span className="text-foreground">
                        {fileConfigLoading
                          ? "Checking..."
                          : hasFiles
                            ? "Available"
                            : "None"}
                      </span>
                    </div>
                  </div>
                ) : null}
                <div className="mt-auto flex items-center text-sm text-primary">
                  View {service.name.toLowerCase()}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
