"use client";

import AnalyticsChart from "@/components/charts/AnalyticsChart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getProjectById } from "@/lib/project";
import { DEFAULT_CHART_WINDOW_DAYS } from "@/lib/date-range";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ProjectResponse } from "juno-sdk/build/main/internal/api";
import { useParams } from "next/navigation";
import { toast } from "sonner";

// simple event types
export interface Event {
  id: string;
  category: string;
  subcategory: string;
  projectId: string;
  environment: string;
  createdAt: string;
  updatedAt: string;
  eventProperties?: EventProperties;
  metricType?: EventMetric;
  eventTypeId?: string;
  properties?: Record<string, string>;
}

export type EventMetric =
  | "click_events"
  | "input_events"
  | "visit_events"
  | "custom_events";

export interface EventProperties {
  objectId?: string;
  userId?: string;
  textValue?: string;
}

// custom event types
export interface CustomEventType {
  id: string;
  category: string;
  subcategory: string;
  properties: string[];
  projectId: string;
}
export interface CustomEvent {
  id: string;
  eventTypeId: string;
  projectId: string;
  environment: string;
  createdAt: string;
  updatedAt: string;
  properties: Record<string, string>;
}

// Window Logic
const TIME_WINDOW_OPTIONS = [7, 14, 30, 60, 90] as const;

type HasCreatedAt = { createdAt: string };

type TimeBounds = {
  start: Date;
  end: Date;
};

const clampWindowDays = (value: number) =>
  Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : DEFAULT_CHART_WINDOW_DAYS;

const offsetDateByDays = (date: Date, offsetDays: number) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + offsetDays);
  return result;
};

const getWindowBounds = (endDate: Date, windowDays: number): TimeBounds => {
  const safeDays = clampWindowDays(windowDays);
  const normalizedEnd = new Date(endDate);
  normalizedEnd.setUTCHours(0, 0, 0, 0);

  const windowStart = new Date(normalizedEnd);
  windowStart.setUTCDate(windowStart.getUTCDate() - (safeDays - 1));

  const windowEnd = new Date(normalizedEnd);
  windowEnd.setUTCHours(23, 59, 59, 999);

  return {
    start: windowStart,
    end: windowEnd,
  };
};

const filterEventsByWindow = <T extends HasCreatedAt>(
  events: T[],
  bounds: TimeBounds
) =>
  events.filter((event) => {
    const createdAt = new Date(event.createdAt).getTime();
    return (
      !Number.isNaN(createdAt) &&
      createdAt >= bounds.start.getTime() &&
      createdAt <= bounds.end.getTime()
    );
  });

const formatWindowRange = ({ start, end }: TimeBounds) => {
  const startLabel = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const endLabel = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`;
};

const AnalyticsPage = () => {
  //breadcrumb logic
  const { projectId } = useParams<{ projectId: string }>();
  // data.name is the project name upon successful fetch
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

  // When fetching/getting all events for simple or custom events, prob have to discuss what is the aftertime and the limit to return.

  // Replace mock click events with results from the API.
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

  // Replace mock input events with results from the API.
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
  // Replace mock visit events with results from the API.
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
    {
      id: "5f2c7f88-0b9c-4a61-88e8-3a7f5a2c1d92",
      category: "auth",
      subcategory: "login_failed",
      projectId: "proj_analytics_web",
      environment: "developer",
      createdAt: "2024-10-24T14:06:02.009Z",
      updatedAt: "2025-10-24T14:06:05.187Z",
      eventProperties: {
        objectId: "sess_Q4p7K0nL",
        userId: "user_7789",
      },
    },
  ];

  // First, fetch all custom event types from endpoint
  const customEventTypes: CustomEventType[] = [
    {
      id: "evt_engagement_feature_usage",
      category: "engagement",
      subcategory: "feature_usage",
      properties: ["featureName", "planTier", "sessionLength"],
      projectId: "proj_analytics_web",
    },
    {
      id: "evt_engagement_feature_shared",
      category: "engagement",
      subcategory: "feature_shared",
      properties: ["featureName", "channel"],
      projectId: "proj_analytics_web",
    },
    {
      id: "evt_billing_invoice_paid",
      category: "billing",
      subcategory: "invoice_paid",
      properties: ["invoiceId", "amount", "currency"],
      projectId: "proj_billing_api",
    },
    {
      id: "evt_billing_refund_issued",
      category: "billing",
      subcategory: "refund_issued",
      properties: ["invoiceId", "amount", "reason"],
      projectId: "proj_billing_api",
    },
  ];
  // Second, need to fetch all custom events for each category - subcategory pair and put into one array.
  const customEvents: CustomEvent[] = [
    {
      id: "evt-usage-001",
      eventTypeId: "evt_engagement_feature_usage",
      projectId: "proj_analytics_web",
      environment: "developer",
      createdAt: "2025-10-24T13:45:00.000Z",
      updatedAt: "2025-10-24T13:45:00.000Z",
      properties: {
        featureName: "dashboards",
        planTier: "growth",
        sessionLength: "420",
      },
    },
    {
      id: "evt-usage-002",
      eventTypeId: "evt_engagement_feature_usage",
      projectId: "proj_analytics_web",
      environment: "developer",
      createdAt: "2025-10-23T18:05:12.120Z",
      updatedAt: "2025-10-23T18:05:12.120Z",
      properties: {
        featureName: "automation",
        planTier: "scale",
        sessionLength: "315",
      },
    },
    {
      id: "evt-shared-001",
      eventTypeId: "evt_engagement_feature_shared",
      projectId: "proj_analytics_web",
      environment: "developer",
      createdAt: "2025-10-22T20:31:44.410Z",
      updatedAt: "2025-10-22T20:31:44.410Z",
      properties: {
        featureName: "dashboards",
        channel: "workspace_invite",
      },
    },
    {
      id: "evt-shared-002",
      eventTypeId: "evt_engagement_feature_shared",
      projectId: "proj_analytics_web",
      environment: "developer",
      createdAt: "2025-10-20T16:13:09.731Z",
      updatedAt: "2025-10-20T16:13:09.731Z",
      properties: {
        featureName: "reporting",
        channel: "public_link",
      },
    },
    {
      id: "evt-invoice-001",
      eventTypeId: "evt_billing_invoice_paid",
      projectId: "proj_billing_api",
      environment: "developer",
      createdAt: "2025-10-24T08:11:50.002Z",
      updatedAt: "2025-10-24T08:11:50.002Z",
      properties: {
        invoiceId: "inv_10899",
        amount: "249.00",
        currency: "USD",
      },
    },
    {
      id: "evt-invoice-002",
      eventTypeId: "evt_billing_invoice_paid",
      projectId: "proj_billing_api",
      environment: "developer",
      createdAt: "2025-10-21T07:54:19.884Z",
      updatedAt: "2025-10-21T07:54:20.102Z",
      properties: {
        invoiceId: "inv_10856",
        amount: "129.00",
        currency: "USD",
      },
    },
    {
      id: "evt-refund-001",
      eventTypeId: "evt_billing_refund_issued",
      projectId: "proj_billing_api",
      environment: "developer",
      createdAt: "2025-10-22T05:30:00.000Z",
      updatedAt: "2025-10-22T05:30:05.415Z",
      properties: {
        invoiceId: "inv_10794",
        amount: "49.00",
        reason: "customer_request",
      },
    },
    {
      id: "evt-refund-002",
      eventTypeId: "evt_billing_refund_issued",
      projectId: "proj_billing_api",
      environment: "developer",
      createdAt: "2025-10-19T10:42:33.557Z",
      updatedAt: "2025-10-19T10:42:33.557Z",
      properties: {
        invoiceId: "inv_10763",
        amount: "99.00",
        reason: "duplicate_charge",
      },
    },
  ];

  const customEventTypesById = new Map<string, CustomEventType>(
    customEventTypes.map((type) => [type.id, type])
  );

  const customEventSubcategoryMap = customEventTypes.reduce<
    Record<string, string[]>
  >((acc, type) => {
    if (!acc[type.category]) {
      acc[type.category] = [];
    }
    if (!acc[type.category].includes(type.subcategory)) {
      acc[type.category].push(type.subcategory);
      acc[type.category].sort();
    }
    return acc;
  }, {});

  const customEventCategoryOptions = Object.keys(
    customEventSubcategoryMap
  ).sort();

  const customEventsBase: Event[] = customEvents.reduce<Event[]>(
    (accumulator, event) => {
      const eventType = customEventTypesById.get(event.eventTypeId);
      if (!eventType) {
        return accumulator;
      }

      accumulator.push({
        id: event.id,
        category: eventType.category,
        subcategory: eventType.subcategory,
        projectId: event.projectId,
        environment: event.environment,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        eventTypeId: event.eventTypeId,
        properties: event.properties,
      });
      return accumulator;
    },
    []
  );

  const tagEventsWithMetric = (events: Event[], metricType: EventMetric) =>
    events.map((event) => ({
      ...event,
      metricType,
    }));

  const customEventsWithMetric = tagEventsWithMetric(
    customEventsBase,
    "custom_events"
  );

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
  const defaultCategory = customEventCategoryOptions[0] ?? "";
  const defaultSubcategory =
    defaultCategory && customEventSubcategoryMap[defaultCategory]
      ? (customEventSubcategoryMap[defaultCategory][0] ?? "")
      : "";

  const [selectedCategory, setSelectedCategory] =
    useState<string>(defaultCategory);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<string>(defaultSubcategory);
  const subcategoryOptions = customEventSubcategoryMap[selectedCategory] ?? [];

  const [simpleWindowDays, setSimpleWindowDays] = useState<number>(
    DEFAULT_CHART_WINDOW_DAYS
  );
  const [simplePageIndex, setSimplePageIndex] = useState(0);

  const baseSimpleEndDate = new Date();

  const simpleEndDate = offsetDateByDays(
    baseSimpleEndDate,
    -simplePageIndex * clampWindowDays(simpleWindowDays)
  );

  const simpleWindowBounds = getWindowBounds(simpleEndDate, simpleWindowDays);

  const filteredSimpleAllEvents = filterEventsByWindow(
    allEventData,
    simpleWindowBounds
  );
  const filteredClickEvents = filterEventsByWindow(
    clickData,
    simpleWindowBounds
  );
  const filteredInputEvents = filterEventsByWindow(
    inputData,
    simpleWindowBounds
  );
  const filteredVisitEvents = filterEventsByWindow(
    visitData,
    simpleWindowBounds
  );

  useEffect(() => {
    if (!selectedCategory && defaultCategory) {
      setSelectedCategory(defaultCategory);
    }
  }, [defaultCategory, selectedCategory]);

  useEffect(() => {
    const options = customEventSubcategoryMap[selectedCategory] ?? [];
    if (options.length === 0) {
      if (selectedSubcategory) {
        setSelectedSubcategory("");
      }
      return;
    }
    if (!selectedSubcategory || !options.includes(selectedSubcategory)) {
      setSelectedSubcategory(options[0]);
    }
  }, [customEventSubcategoryMap, selectedCategory, selectedSubcategory]);

  // Window logic

  const [customWindowDays, setCustomWindowDays] = useState<number>(
    DEFAULT_CHART_WINDOW_DAYS
  );
  const [customPageIndex, setCustomPageIndex] = useState(0);

  const hasOlderSimple = allEventData.some(
    (event) =>
      new Date(event.createdAt).getTime() < simpleWindowBounds.start.getTime()
  );
  const canPageNewerSimple = simplePageIndex > 0;

  const simpleRangeLabel = formatWindowRange(simpleWindowBounds);

  const customEventsForSelection = customEventsWithMetric.filter(
    (event) =>
      (!selectedCategory || event.category === selectedCategory) &&
      (!selectedSubcategory || event.subcategory === selectedSubcategory)
  );

  const baseCustomEndDate = new Date();

  const customEndDate = offsetDateByDays(
    baseCustomEndDate,
    -customPageIndex * clampWindowDays(customWindowDays)
  );

  const customWindowBounds = getWindowBounds(customEndDate, customWindowDays);

  const filteredCustomEvents = filterEventsByWindow(
    customEventsForSelection,
    customWindowBounds
  );

  const hasOlderCustom = customEventsForSelection.some(
    (event) =>
      new Date(event.createdAt).getTime() < customWindowBounds.start.getTime()
  );
  const canPageNewerCustom = customPageIndex > 0;

  useEffect(() => {
    setCustomPageIndex(0);
  }, [selectedCategory, selectedSubcategory]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const options = customEventSubcategoryMap[value] ?? [];
    setSelectedSubcategory(options[0] ?? "");
    setCustomPageIndex(0);
  };

  const handleSimpleWindowChange = (value: string) => {
    const parsed = Number(value);
    setSimpleWindowDays(clampWindowDays(parsed));
    setSimplePageIndex(0);
  };

  const handleCustomWindowChange = (value: string) => {
    const parsed = Number(value);
    setCustomWindowDays(clampWindowDays(parsed));
    setCustomPageIndex(0);
  };

  const goToOlderSimple = () => {
    if (hasOlderSimple) {
      setSimplePageIndex((previous) => previous + 1);
    }
  };

  const goToNewerSimple = () => {
    setSimplePageIndex((previous) => (previous > 0 ? previous - 1 : 0));
  };

  const goToOlderCustom = () => {
    if (hasOlderCustom) {
      setCustomPageIndex((previous) => previous + 1);
    }
  };

  const goToNewerCustom = () => {
    setCustomPageIndex((previous) => (previous > 0 ? previous - 1 : 0));
  };

  const customRangeLabel = formatWindowRange(customWindowBounds);

  const customChartDescription =
    selectedCategory && selectedSubcategory
      ? `Custom events captured for ${selectedCategory} / ${selectedSubcategory} · ${customRangeLabel}`
      : `Custom events over time · ${customRangeLabel}`;

  const hasCustomOptions = customEventCategoryOptions.length > 0;

  //need to make a loading state and fill into all analyticschart when hooking up API calls for click, input, visit, and custom event data
  return (
    <div className="p-6 max-w-[70%]">
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
            <BreadcrumbPage>Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="mb-6 text-xl">Analytics </h1>

      {/* Simple Events Window */}
      <div className="space-y-6 w-full">
        <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Simple events window · {simpleRangeLabel}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="simple-event-window"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Window
              </Label>
              <Select
                value={simpleWindowDays.toString()}
                onValueChange={handleSimpleWindowChange}
              >
                <SelectTrigger id="simple-event-window" className="w-[120px]">
                  <SelectValue placeholder="Window" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_WINDOW_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option} days
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TooltipProvider>
              <div className="flex items-center gap-2">
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!hasOlderSimple}
                        onClick={goToOlderSimple}
                      >
                        Older
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!hasOlderSimple && (
                    <TooltipContent side="top">
                      No older data available
                    </TooltipContent>
                  )}
                </Tooltip>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!canPageNewerSimple}
                        onClick={goToNewerSimple}
                      >
                        Newer
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!canPageNewerSimple && (
                    <TooltipContent side="top">
                      No newer data available
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>

        {/* Simple Events */}
        <div className="space-y-6">
          <AnalyticsChart
            title="All Simple Event Types"
            description={`Click, input, and visit events over time · ${simpleRangeLabel}`}
            metrics={aggregateEventMetrics}
            data={filteredSimpleAllEvents}
            loading={false}
            windowDays={simpleWindowDays}
            endDate={simpleEndDate}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnalyticsChart
              title="Click Events"
              description="Click events over time"
              metrics={["click_events"]}
              data={filteredClickEvents}
              loading={false}
              windowDays={simpleWindowDays}
              endDate={simpleEndDate}
            />
            <AnalyticsChart
              title="Input Events"
              description="Input events over time"
              metrics={["input_events"]}
              data={filteredInputEvents}
              loading={false}
              windowDays={simpleWindowDays}
              endDate={simpleEndDate}
            />
            <AnalyticsChart
              title="Visit Events"
              description="Visit events over time"
              metrics={["visit_events"]}
              data={filteredVisitEvents}
              loading={false}
              windowDays={simpleWindowDays}
              endDate={simpleEndDate}
            />
          </div>
        </div>

        {/* Custom Events Window */}
        <div className="space-y-4">
          <div className="grid gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="custom-event-category">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
                disabled={!hasCustomOptions}
              >
                <SelectTrigger id="custom-event-category">
                  <SelectValue
                    placeholder={
                      customEventTypes.length > 0
                        ? "Select Category"
                        : "There are no custom categories for this project"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {customEventCategoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-event-subcategory">Subcategory</Label>
              <Select
                value={selectedSubcategory}
                onValueChange={setSelectedSubcategory}
                disabled={subcategoryOptions.length === 0}
              >
                <SelectTrigger id="custom-event-subcategory">
                  <SelectValue
                    placeholder={
                      customEventTypes.length > 0
                        ? "Select subcategory"
                        : "There are no custom subcategories for this project"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {subcategoryOptions.map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Events */}
          <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Custom events window · {customRangeLabel}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="custom-event-window"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Window
                </Label>
                <Select
                  value={customWindowDays.toString()}
                  onValueChange={handleCustomWindowChange}
                  disabled={!hasCustomOptions}
                >
                  <SelectTrigger id="custom-event-window" className="w-[120px]">
                    <SelectValue placeholder="Window" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_WINDOW_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option} days
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!hasOlderCustom}
                          onClick={goToOlderCustom}
                        >
                          Older
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!hasOlderCustom && (
                      <TooltipContent side="top">
                        No older data available
                      </TooltipContent>
                    )}
                  </Tooltip>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!canPageNewerCustom}
                          onClick={goToNewerCustom}
                        >
                          Newer
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!canPageNewerCustom && (
                      <TooltipContent side="top">
                        No newer data available
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
          <AnalyticsChart
            title="Custom Events"
            description={customChartDescription}
            metrics={["custom_events"]}
            data={filteredCustomEvents}
            loading={false}
            windowDays={customWindowDays}
            endDate={customEndDate}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
