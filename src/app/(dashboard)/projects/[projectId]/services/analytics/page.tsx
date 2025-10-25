"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import EmailAnalyticsChart from "@/components/charts/EmailAnalyticsChart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import AnalyticsChart from "@/components/charts/AnalyticsChart";

export interface Event {
  id: string;
  category: string;
  subcategory: string;
  projectId: string;
  environment: string;
  createdAt: string;
  updatedAt: string;
  eventProperties: EventProperties;
  metricType?: EventMetric;
}

export type EventMetric = "click_events" | "input_events" | "visit_events";

export interface EventProperties {
  objectId: string;
  userId: string;
}

const clickData: Event[] = [
  {
    id: "8c1a6f5b-4b7e-4a98-9d7c-7b0f8d2db2a1",
    category: "auth",
    subcategory: "login_success",
    projectId: "proj_analytics_web",
    environment: "developer",
    createdAt: "2025-10-24T14:05:12.341Z",
    updatedAt: "2025-10-24T14:05:12.341Z",
    eventProperties: {
      objectId: "sess_8Jw2sZ2M",
      userId: "user_1245",
    },
  },
  {
    id: "5f2c7f88-0b9c-4a61-88e8-3a7f5a2c1d92",
    category: "auth",
    subcategory: "login_failed",
    projectId: "proj_analytics_web",
    environment: "developer",
    createdAt: "2025-10-24T14:06:02.009Z",
    updatedAt: "2025-10-24T14:06:05.187Z",
    eventProperties: {
      objectId: "sess_Q4p7K0nL",
      userId: "user_7789",
    },
  },
  {
    id: "2d3c1a44-2a05-4c3b-9b2f-6b1a7a9f1a33",
    category: "analytics",
    subcategory: "page_view",
    projectId: "proj_marketing_site",
    environment: "developer",
    createdAt: "2025-10-23T09:12:40.120Z",
    updatedAt: "2025-10-23T09:12:40.120Z",
    eventProperties: {
      objectId: "page_/pricing",
      userId: "anon_53a2",
    },
  },
  {
    id: "a9d7f2b3-6c41-4d6f-8e22-0d3bf9b1a0a4",
    category: "payment",
    subcategory: "charge_succeeded",
    projectId: "proj_checkout_service",
    environment: "developer",
    createdAt: "2025-10-22T18:20:02.550Z",
    updatedAt: "2025-10-22T18:20:03.004Z",
    eventProperties: {
      objectId: "ch_1PQ8xyFf9",
      userId: "user_3021",
    },
  },
  {
    id: "3e4b8a11-7e56-4a7f-a2b0-5f2a1c8b9f77",
    category: "payment",
    subcategory: "charge_failed",
    projectId: "proj_checkout_service",
    environment: "developer",
    createdAt: "2025-10-22T18:22:11.919Z",
    updatedAt: "2025-10-22T18:22:12.221Z",
    eventProperties: {
      objectId: "ch_1PQ8z0GHY",
      userId: "user_3021",
    },
  },
  {
    id: "f71d9bb2-2f9b-4b1c-9c6e-5b0de2a1c645",
    category: "deployment",
    subcategory: "release_created",
    projectId: "proj_api_gateway",
    environment: "developer",
    createdAt: "2025-10-21T11:04:00.000Z",
    updatedAt: "2025-10-21T11:04:00.000Z",
    eventProperties: {
      objectId: "rel_2025.10.21-rc1",
      userId: "user_devops_01",
    },
  },
  {
    id: "0b8a6e2b-41e0-4b27-9c2b-3f8e1a5d0c92",
    category: "deployment",
    subcategory: "release_deployed",
    projectId: "proj_api_gateway",
    environment: "developer",
    createdAt: "2025-10-21T11:24:10.235Z",
    updatedAt: "2025-10-21T11:24:45.612Z",
    eventProperties: {
      objectId: "rel_2025.10.21-rc1",
      userId: "user_devops_01",
    },
  },
  {
    id: "b2c9a1e0-9d4a-4d5f-8a6b-7c1e2f3a4b5c",
    category: "feature_flag",
    subcategory: "toggle_on",
    projectId: "proj_experiments",
    environment: "developer",
    createdAt: "2025-10-20T15:40:01.100Z",
    updatedAt: "2025-10-20T15:40:01.100Z",
    eventProperties: {
      objectId: "fflag_new_nav_v2",
      userId: "user_pm_09",
    },
  },
  {
    id: "9f7a2b5e-3c1a-4e78-8d9b-6e1f2a3b4c5d",
    category: "notification",
    subcategory: "email_sent",
    projectId: "proj_comm_platform",
    environment: "developer",
    createdAt: "2025-10-24T08:15:12.000Z",
    updatedAt: "2025-10-24T08:15:12.000Z",
    eventProperties: {
      objectId: "email_7d12ac9",
      userId: "user_1245",
    },
  },
  {
    id: "c4d2e1a9-7b6a-4f3e-9a1b-2c3d4e5f6a7b",
    category: "billing",
    subcategory: "invoice_paid",
    projectId: "proj_finops",
    environment: "developer",
    createdAt: "2025-10-19T10:02:45.777Z",
    updatedAt: "2025-10-19T10:03:10.003Z",
    eventProperties: {
      objectId: "inv_2025-10-19_000234",
      userId: "user_9981",
    },
  },
  {
    id: "e6a1b2c3-d4e5-46f7-98a1-b2c3d4e5f6a7",
    category: "security",
    subcategory: "password_reset_request",
    projectId: "proj_auth_service",
    environment: "developer",
    createdAt: "2025-10-25T01:12:30.421Z",
    updatedAt: "2025-10-25T01:12:30.421Z",
    eventProperties: {
      objectId: "token_rp_7f1a9c",
      userId: "user_5678",
    },
  },
  {
    id: "1a2b3c4d-5e6f-7081-92a3-b4c5d6e7f809",
    category: "data_pipeline",
    subcategory: "ingest_started",
    projectId: "proj_etl_core",
    environment: "developer",
    createdAt: "2025-10-18T06:00:00.000Z",
    updatedAt: "2025-10-18T06:00:05.250Z",
    eventProperties: {
      objectId: "job_daily_orders_2025-10-18",
      userId: "system",
    },
  },
];

const inputData: Event[] = [
  {
    id: "8c1a6f5b-4b7e-4a98-9d7c-7b0f8d2db2a1",
    category: "auth",
    subcategory: "login_success",
    projectId: "proj_analytics_web",
    environment: "developer",
    createdAt: "2025-10-24T14:05:12.341Z",
    updatedAt: "2025-10-24T14:05:12.341Z",
    eventProperties: {
      objectId: "sess_8Jw2sZ2M",
      userId: "user_1245",
    },
  },
  {
    id: "5f2c7f88-0b9c-4a61-88e8-3a7f5a2c1d92",
    category: "auth",
    subcategory: "login_failed",
    projectId: "proj_analytics_web",
    environment: "developer",
    createdAt: "2025-10-24T14:06:02.009Z",
    updatedAt: "2025-10-24T14:06:05.187Z",
    eventProperties: {
      objectId: "sess_Q4p7K0nL",
      userId: "user_7789",
    },
  },
  {
    id: "2d3c1a44-2a05-4c3b-9b2f-6b1a7a9f1a33",
    category: "analytics",
    subcategory: "page_view",
    projectId: "proj_marketing_site",
    environment: "developer",
    createdAt: "2025-10-23T09:12:40.120Z",
    updatedAt: "2025-10-23T09:12:40.120Z",
    eventProperties: {
      objectId: "page_/pricing",
      userId: "anon_53a2",
    },
  },
  {
    id: "a9d7f2b3-6c41-4d6f-8e22-0d3bf9b1a0a4",
    category: "payment",
    subcategory: "charge_succeeded",
    projectId: "proj_checkout_service",
    environment: "developer",
    createdAt: "2025-10-22T18:20:02.550Z",
    updatedAt: "2025-10-22T18:20:03.004Z",
    eventProperties: {
      objectId: "ch_1PQ8xyFf9",
      userId: "user_3021",
    },
  },
  {
    id: "3e4b8a11-7e56-4a7f-a2b0-5f2a1c8b9f77",
    category: "payment",
    subcategory: "charge_failed",
    projectId: "proj_checkout_service",
    environment: "developer",
    createdAt: "2025-10-22T18:22:11.919Z",
    updatedAt: "2025-10-22T18:22:12.221Z",
    eventProperties: {
      objectId: "ch_1PQ8z0GHY",
      userId: "user_3021",
    },
  },
  {
    id: "f71d9bb2-2f9b-4b1c-9c6e-5b0de2a1c645",
    category: "deployment",
    subcategory: "release_created",
    projectId: "proj_api_gateway",
    environment: "developer",
    createdAt: "2025-10-21T11:04:00.000Z",
    updatedAt: "2025-10-21T11:04:00.000Z",
    eventProperties: {
      objectId: "rel_2025.10.21-rc1",
      userId: "user_devops_01",
    },
  },
  {
    id: "0b8a6e2b-41e0-4b27-9c2b-3f8e1a5d0c92",
    category: "deployment",
    subcategory: "release_deployed",
    projectId: "proj_api_gateway",
    environment: "developer",
    createdAt: "2025-10-21T11:24:10.235Z",
    updatedAt: "2025-10-21T11:24:45.612Z",
    eventProperties: {
      objectId: "rel_2025.10.21-rc1",
      userId: "user_devops_01",
    },
  },
];
const visitData: Event[] = [
  {
    id: "8c1a6f5b-4b7e-4a98-9d7c-7b0f8d2db2a1",
    category: "auth",
    subcategory: "login_success",
    projectId: "proj_analytics_web",
    environment: "developer",
    createdAt: "2025-10-24T14:05:12.341Z",
    updatedAt: "2025-10-24T14:05:12.341Z",
    eventProperties: {
      objectId: "sess_8Jw2sZ2M",
      userId: "user_1245",
    },
  },
  {
    id: "5f2c7f88-0b9c-4a61-88e8-3a7f5a2c1d92",
    category: "auth",
    subcategory: "login_failed",
    projectId: "proj_analytics_web",
    environment: "developer",
    createdAt: "2025-10-24T14:06:02.009Z",
    updatedAt: "2025-10-24T14:06:05.187Z",
    eventProperties: {
      objectId: "sess_Q4p7K0nL",
      userId: "user_7789",
    },
  },
];

const tagEventsWithMetric = (events: Event[], metricType: EventMetric) =>
  events.map((event) => ({
    ...event,
    metricType,
  }));

const aggregateEventMetrics: EventMetric[] = [
  "click_events",
  "input_events",
  "visit_events",
];

const allEventData: Event[] = [
  ...tagEventsWithMetric(clickData, "click_events"),
  ...tagEventsWithMetric(inputData, "input_events"),
  ...tagEventsWithMetric(visitData, "visit_events"),
];

const AnalyticsPage = () => {
  //   const { projectId } = useParams();

  //   const [hasEmailConfig, setHasEmailConfig] = useState(null);
  //   const [emailConfigLoading, setEmailConfigLoading] = useState(true);
  //   const [emailAnalytics, setEmailAnalytics] = useState(null);
  //   const [analyticsLoading, setAnalyticsLoading] = useState(false);

  //   useEffect(() => {
  //     const loadEmailData = async () => {
  //       try {
  //         const configRes = await getEmailConfig(String(projectId));
  //         if (configRes) {
  //           setHasEmailConfig(configRes);
  //           setEmailConfigLoading(false);

  //           setAnalyticsLoading(true);
  //           const analyticsRes = await getEmailAnalytics(String(projectId));
  //           if (analyticsRes.success) {
  //             setEmailAnalytics(analyticsRes.analytics);
  //           } else {
  //             console.error("Failed to fetch analytics:", analyticsRes.error);
  //             toast.error("Failed to load email analytics", {
  //               description: analyticsRes.error,
  //             });
  //           }
  //           setAnalyticsLoading(false);
  //         } else {
  //           setEmailConfigLoading(false);
  //         }
  //       } catch (e) {
  //         console.error("Error loading email data:", e);
  //         setEmailConfigLoading(false);
  //         toast.error("Error loading email data", {
  //           description: "Please try again later",
  //         });
  //       }
  //     };

  //     loadEmailData();
  //   }, [projectId]);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl">
        Analytics{" "}
        <span className="text-sm text-gray-400">from the past 30 days</span>
      </h1>
      <div className="space-y-6">
        <AnalyticsChart
          title="All Event Types"
          description="Click, input, and visit events over time"
          metrics={aggregateEventMetrics}
          data={allEventData}
          loading={false}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnalyticsChart
            title="Click Events"
            description="Click events over time"
            metrics={["click_events"]}
            data={clickData}
            loading={false}
          />
          <AnalyticsChart
            title="Input Events"
            description="Input events over time"
            metrics={["input_events"]}
            data={inputData}
            loading={false}
          />
          <AnalyticsChart
            title="Visit Events"
            description="Visit events over time"
            metrics={["visit_events"]}
            data={visitData}
            loading={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
