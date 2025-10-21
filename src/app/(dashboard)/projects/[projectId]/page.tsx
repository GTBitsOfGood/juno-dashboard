"use client";

import { getJunoProject } from "@/lib/sdkActions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmailAnalyticsChart from "@/components/charts/EmailAnalyticsChart";
import { Skeleton } from "@/components/ui/skeleton";
import { getEmailConfig, getEmailAnalytics } from "@/lib/settings";

const ProjectPage = () => {
  const { projectId } = useParams();

  const [projectName, setProjectName] = useState(null);
  const [loading, setLoading] = useState(true);

  const [hasEmailConfig, setHasEmailConfig] = useState(null);
  const [emailConfigLoading, setEmailConfigLoading] = useState(true);
  const [emailAnalytics, setEmailAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    const displayProjectName = async () => {
      try {
        const res = await getJunoProject({ id: Number(projectId) });
        if (res.success) {
          const name = res.projectName;
          setProjectName(name);
          setLoading(false);
        } else {
          toast.error("Error", {
            description: "Failed to get project",
          });
        }
      } catch (e) {
        console.error("Error getting project:", e);
      }
    };

    const displayEmailConfig = async () => {
      setEmailConfigLoading(true);
      setAnalyticsLoading(true);
      setEmailAnalytics(null);
      try {
        const res = await getEmailConfig(String(projectId));

        if (res) {
          setHasEmailConfig(true);
          const analyticsRes = await getEmailAnalytics(String(projectId));
          if (analyticsRes.success) {
            setEmailAnalytics(analyticsRes.analytics);
          } else {
            console.error("Failed to fetch analytics:", analyticsRes.error);
            toast.error("Failed to load email analytics", {
              description: analyticsRes.error,
            });
          }
        } else {
          setHasEmailConfig(false);
          setEmailAnalytics(null);
        }
      } catch (e) {
        console.error("Error getting email config", e);
        setHasEmailConfig(false);
        toast.error("Error loading email configuration", {
          description: "Please try again later.",
        });
      } finally {
        setEmailConfigLoading(false);
        setAnalyticsLoading(false);
      }
    };

    displayProjectName();
    displayEmailConfig();
  }, [projectId]);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl">
        {loading ? <Skeleton className="w-32 h-7" /> : projectName}
      </h1>
      <div className="w-100">
        {emailConfigLoading ? (
          <div className="w-100">
            <Skeleton className="h-64" />
          </div>
        ) : hasEmailConfig ? (
          <div className="grid">
            <EmailAnalyticsChart
              projectId={String(projectId)}
              title="Email Performance"
              description="All key metrics over time"
              metrics={["delivered", "opens", "clicks", "bounces"]}
              data={emailAnalytics}
              loading={analyticsLoading}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <h1>There is no email service config set up for this project</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
