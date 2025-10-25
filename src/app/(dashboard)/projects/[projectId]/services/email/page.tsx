"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmailAnalyticsChart from "@/components/charts/EmailAnalyticsChart";
import { Skeleton } from "@/components/ui/skeleton";
import { getEmailConfig, getEmailAnalytics } from "@/lib/settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EmailAnalyticsPage = () => {
  const { projectId } = useParams();

  const [hasEmailConfig, setHasEmailConfig] = useState(null);
  const [emailConfigLoading, setEmailConfigLoading] = useState(true);
  const [emailAnalytics, setEmailAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

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
            <CardTitle>No Email Configuration</CardTitle>
            <CardDescription>
              This project does not have an email service configured yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please configure your email service first to view analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
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
