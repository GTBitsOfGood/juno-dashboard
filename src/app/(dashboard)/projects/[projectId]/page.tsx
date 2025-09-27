"use client";

import { getJunoProject } from "@/lib/sdkActions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmailAnalyticsChart from "@/components/charts/EmailAnalyticsChart";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectPage = () => {
  const { projectId } = useParams();

  const [projectName, setProjectName] = useState(null);
  const [loading, setLoading] = useState(true);

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

    displayProjectName();
  }, [projectId]);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl">
        {loading ? <Skeleton className="w-32 h-7" /> : projectName}
      </h1>
      <div className="w-100">
        <div className="flex grid grid-cols-2 flex-1 items-start gap-10">
          <EmailAnalyticsChart />
          <EmailAnalyticsChart />
          <EmailAnalyticsChart />
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
