"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getProjectById } from "@/lib/project";
import { DEFAULT_CHART_WINDOW_DAYS } from "@/lib/date-range";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { ProjectResponse } from "juno-sdk/build/main/internal/api";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  getAllClickEvents,
  getAllInputEvents,
  getAllVisitEvents,
  getCustomEventTypes,
  getAllCustomEvents,
} from "@/lib/settings";
import SimpleEventsSection from "@/components/analytics/SimpleEventsSection";
import CustomEventsSection from "@/components/analytics/CustomEventsSection";
import {
  Event,
  EventMetric,
  CustomEventType,
  CustomEvent,
} from "@/components/analytics/types";

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
  bounds: TimeBounds,
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

  const { isLoading, isError, data, error } = useQuery<ProjectResponse>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const result = await getProjectById(Number(projectId));
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.project;
    },
    staleTime: 1000,
    refetchOnWindowFocus: true,
  });

  if (isError) {
    toast.error("Error", {
      description: `Failed to fetch project: ${JSON.stringify(error)}`,
    });
  }

  // const projectName = data?.name;
  const projectName = "Infra Testing Project";

  const {
    data: clickEventsResponse,
    isLoading: clickLoading,
    isError: clickError,
  } = useQuery({
    queryKey: ["clickEvents", projectName],
    queryFn: async () => {
      if (!projectName) return { success: false, events: [] };
      return getAllClickEvents(projectName, { limit: 1000 });
    },
    enabled: !!projectName,
    staleTime: 1000,
    refetchOnWindowFocus: true,
  });

  const {
    data: inputEventsResponse,
    isLoading: inputLoading,
    isError: inputError,
  } = useQuery({
    queryKey: ["inputEvents", projectName],
    queryFn: async () => {
      if (!projectName) return { success: false, events: [] };
      return getAllInputEvents(projectName, { limit: 1000 });
    },
    enabled: !!projectName,
    staleTime: 1000,
    refetchOnWindowFocus: true,
  });

  const {
    data: visitEventsResponse,
    isLoading: visitLoading,
    isError: visitError,
  } = useQuery({
    queryKey: ["visitEvents", projectName],
    queryFn: async () => {
      if (!projectName) return { success: false, events: [] };
      return getAllVisitEvents(projectName, { limit: 1000 });
    },
    enabled: !!projectName,
    staleTime: 1000,
    refetchOnWindowFocus: true,
  });

  const {
    data: customEventTypesResponse,
    isLoading: customTypesLoading,
    isError: customTypesError,
  } = useQuery({
    queryKey: ["customEventTypes", projectName],
    queryFn: async () => {
      if (!projectName) return { success: false, eventTypes: [] };
      return getCustomEventTypes(projectName);
    },
    enabled: !!projectName,
    staleTime: 1000,
    refetchOnWindowFocus: true,
  });

  const clickData: Event[] = clickEventsResponse?.events?.events || [];
  const inputData: Event[] = inputEventsResponse?.events?.events || [];
  const visitData: Event[] = visitEventsResponse?.events?.events || [];

  const customEventTypes: CustomEventType[] = (() => {
    const types = customEventTypesResponse?.eventTypes;
    if (!types) return [];
    if (Array.isArray(types)) return types;
    return [types];
  })();

  useEffect(() => {
    if (clickError) {
      toast.error("Failed to load click events");
    }
    if (inputError) {
      toast.error("Failed to load input events");
    }
    if (visitError) {
      toast.error("Failed to load visit events");
    }
    if (customTypesError) {
      toast.error("Failed to load custom event types");
    }
  }, [clickError, inputError, visitError, customTypesError]);

  const eventsLoading =
    (isLoading ||
      clickLoading ||
      inputLoading ||
      visitLoading ||
      customTypesLoading) &&
    !clickError &&
    !inputError &&
    !visitError &&
    !customTypesError;

  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
  const [customEventsLoading, setCustomEventsLoading] = useState(false);

  const customEventTypesJson = JSON.stringify(customEventTypes);

  useEffect(() => {
    const fetchAllCustomEvents = async () => {
      const types = JSON.parse(customEventTypesJson) as CustomEventType[];

      if (!projectName || types.length === 0) {
        setCustomEvents([]);
        return;
      }

      setCustomEventsLoading(true);
      try {
        const allCustomEvents: CustomEvent[] = [];

        for (const eventType of types) {
          const result = await getAllCustomEvents(
            projectName,
            eventType.category,
            eventType.subcategory,
            { limit: 1000 },
          );

          if (result.success && result.events?.events) {
            allCustomEvents.push(...result.events.events);
          }
        }

        setCustomEvents(allCustomEvents);
      } catch (error) {
        console.error("Error fetching custom events:", error);
        toast.error("Failed to load custom events");
        setCustomEvents([]);
      } finally {
        setCustomEventsLoading(false);
      }
    };

    fetchAllCustomEvents();
  }, [projectName, customEventTypesJson]);

  const customEventTypesById = useMemo(
    () =>
      new Map<string, CustomEventType>(
        customEventTypes.map((type) => [type.id, type]),
      ),
    [customEventTypes],
  );

  const customEventSubcategoryMap = useMemo(
    () =>
      customEventTypes.reduce<Record<string, string[]>>((acc, type) => {
        if (!acc[type.category]) {
          acc[type.category] = [];
        }
        if (!acc[type.category].includes(type.subcategory)) {
          acc[type.category].push(type.subcategory);
          acc[type.category].sort();
        }
        return acc;
      }, {}),
    [customEventTypes],
  );

  const customEventCategoryOptions = useMemo(
    () => Object.keys(customEventSubcategoryMap).sort(),
    [customEventSubcategoryMap],
  );

  const customEventsBase = useMemo(
    () =>
      customEvents.reduce<Event[]>((accumulator, event) => {
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
      }, []),
    [customEvents, customEventTypesById],
  );

  const tagEventsWithMetric = (events: Event[], metricType: EventMetric) =>
    events.map((event) => ({
      ...event,
      metricType,
    }));

  const customEventsWithMetric = useMemo(
    () => tagEventsWithMetric(customEventsBase, "custom_events"),
    [customEventsBase],
  );

  const allEventData = useMemo(
    () => [
      ...tagEventsWithMetric(clickData, "click_events"),
      ...tagEventsWithMetric(inputData, "input_events"),
      ...tagEventsWithMetric(visitData, "visit_events"),
    ],
    [clickData, inputData, visitData],
  );

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
    DEFAULT_CHART_WINDOW_DAYS,
  );
  const [simplePageIndex, setSimplePageIndex] = useState(0);

  const baseSimpleEndDate = new Date();

  const simpleEndDate = offsetDateByDays(
    baseSimpleEndDate,
    -simplePageIndex * clampWindowDays(simpleWindowDays),
  );

  const simpleWindowBounds = getWindowBounds(simpleEndDate, simpleWindowDays);

  const filteredSimpleAllEvents = filterEventsByWindow(
    allEventData,
    simpleWindowBounds,
  );
  const filteredClickEvents = filterEventsByWindow(
    clickData,
    simpleWindowBounds,
  );
  const filteredInputEvents = filterEventsByWindow(
    inputData,
    simpleWindowBounds,
  );
  const filteredVisitEvents = filterEventsByWindow(
    visitData,
    simpleWindowBounds,
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
    DEFAULT_CHART_WINDOW_DAYS,
  );
  const [customPageIndex, setCustomPageIndex] = useState(0);

  const hasOlderSimple = allEventData.some(
    (event) =>
      new Date(event.createdAt).getTime() < simpleWindowBounds.start.getTime(),
  );
  const canPageNewerSimple = simplePageIndex > 0;

  const simpleRangeLabel = formatWindowRange(simpleWindowBounds);

  const customEventsForSelection = customEventsWithMetric.filter(
    (event) =>
      (!selectedCategory || event.category === selectedCategory) &&
      (!selectedSubcategory || event.subcategory === selectedSubcategory),
  );

  const baseCustomEndDate = new Date();

  const customEndDate = offsetDateByDays(
    baseCustomEndDate,
    -customPageIndex * clampWindowDays(customWindowDays),
  );

  const customWindowBounds = getWindowBounds(customEndDate, customWindowDays);

  const filteredCustomEvents = filterEventsByWindow(
    customEventsForSelection,
    customWindowBounds,
  );

  const hasOlderCustom = customEventsForSelection.some(
    (event) =>
      new Date(event.createdAt).getTime() < customWindowBounds.start.getTime(),
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

  const hasCustomOptions = customEventCategoryOptions.length > 0;

  const currentEventType = useMemo(() => {
    return customEventTypes.find(
      (type) =>
        type.category === selectedCategory &&
        type.subcategory === selectedSubcategory,
    );
  }, [customEventTypes, selectedCategory, selectedSubcategory]);

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

      <div className="space-y-6 w-full">
        <SimpleEventsSection
          filteredAllEvents={filteredSimpleAllEvents}
          filteredClickEvents={filteredClickEvents}
          filteredInputEvents={filteredInputEvents}
          filteredVisitEvents={filteredVisitEvents}
          eventsLoading={eventsLoading}
          windowDays={simpleWindowDays}
          endDate={simpleEndDate}
          rangeLabel={simpleRangeLabel}
          onWindowChange={handleSimpleWindowChange}
          onGoOlder={goToOlderSimple}
          onGoNewer={goToNewerSimple}
          canGoOlder={hasOlderSimple}
          canGoNewer={canPageNewerSimple}
          timeWindowOptions={TIME_WINDOW_OPTIONS}
        />

        <CustomEventsSection
          filteredCustomEvents={filteredCustomEvents}
          customEventsLoading={customEventsLoading}
          windowDays={customWindowDays}
          endDate={customEndDate}
          rangeLabel={customRangeLabel}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          categoryOptions={customEventCategoryOptions}
          subcategoryOptions={subcategoryOptions}
          currentEventType={currentEventType}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={setSelectedSubcategory}
          onWindowChange={handleCustomWindowChange}
          onGoOlder={goToOlderCustom}
          onGoNewer={goToNewerCustom}
          canGoOlder={hasOlderCustom}
          canGoNewer={canPageNewerCustom}
          timeWindowOptions={TIME_WINDOW_OPTIONS}
          hasCustomOptions={hasCustomOptions}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
