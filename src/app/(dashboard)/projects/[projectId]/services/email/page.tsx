"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmailAnalyticsChart from "@/components/charts/EmailAnalyticsChart";
import { Skeleton } from "@/components/ui/skeleton";
import { getEmailConfig, getEmailAnalytics } from "@/lib/settings";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/lib/project";
import { ProjectResponse } from "juno-sdk/build/main/internal/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Settings } from "lucide-react";
import Link from "next/link";

const EmailAnalyticsPage = () => {
  const { projectId } = useParams();

  const [hasEmailConfig, setHasEmailConfig] = useState(null);
  const [emailConfigLoading, setEmailConfigLoading] = useState(true);
  const [emailAnalytics, setEmailAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const { isLoading, isError, data, error } = useQuery<ProjectResponse>({
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
    const loadEmailData = async () => {
      try {
        const configRes = await getEmailConfig(String(projectId));
        if (configRes) {
          setHasEmailConfig(configRes);
          setEmailConfigLoading(false);

          setAnalyticsLoading(true);
          const analyticsRes = await getEmailAnalytics(String(projectId));
          if (analyticsRes.success) {
            setEmailAnalytics(analyticsRes.analytics);
          } else {
            console.error("Failed to fetch analytics:", analyticsRes.error);
            toast.error("Failed to load email analytics", {
              description: analyticsRes.error,
            });
          }
          setAnalyticsLoading(false);
        } else {
          setEmailConfigLoading(false);
        }
      } catch (e) {
        console.error("Error loading email data:", e);
        setEmailConfigLoading(false);
        toast.error("Error loading email data", {
          description: "Please try again later",
        });
      }
    };

    loadEmailData();
  }, [projectId]);

  if (emailConfigLoading) {
    return (
      <div className="p-6">
        <h1 className="mb-6 text-xl">Email Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!hasEmailConfig) {
    return (
      <div className="p-6">
        <h1 className="mb-6 text-xl">Email Analytics</h1>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <CardTitle>No Email Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure your email service to view your analytics through Juno.
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
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${projectId}`}>
              {isLoading ? "****" : (data?.name ?? "Unknown")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Email Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="mb-6 text-xl">
        Email Analytics{" "}
        <span className="text-sm text-gray-400">from the past 30 days</span>
      </h1>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EmailAnalyticsChart
            projectId={String(projectId)}
            title="Email Delivery"
            description="Delivered vs Bounced emails over time"
            metrics={["delivered", "bounces"]}
            data={emailAnalytics}
            loading={analyticsLoading}
          />
          <EmailAnalyticsChart
            projectId={String(projectId)}
            title="Email Engagement"
            description="Opens and clicks over time"
            metrics={["opens", "clicks"]}
            data={emailAnalytics}
            loading={analyticsLoading}
          />
          <EmailAnalyticsChart
            projectId={String(projectId)}
            title="Email Performance"
            description="All key metrics over time"
            metrics={["delivered", "opens", "clicks", "bounces"]}
            data={emailAnalytics}
            loading={analyticsLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmailAnalyticsChart
            projectId={String(projectId)}
            title="Email Quality"
            description="Spam reports and unsubscribes over time"
            metrics={["spam_reports", "unsubscribes"]}
            data={emailAnalytics}
            loading={analyticsLoading}
          />
          <EmailAnalyticsChart
            projectId={String(projectId)}
            title="Email Processing"
            description="Processed and deferred emails over time"
            metrics={["processed", "deferred"]}
            data={emailAnalytics}
            loading={analyticsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailAnalyticsPage;
