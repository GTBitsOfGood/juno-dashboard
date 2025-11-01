"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { useCallback, useMemo } from "react";

import { DEFAULT_CHART_WINDOW_DAYS, getIsoDateRange } from "@/lib/date-range";
import { Skeleton } from "../ui/skeleton";

type Row = { date: string } & Record<string, number | string>;

const chartConfig = {
  click_events: {
    label: "Clicks",
    color: "hsl(var(--chart-1))",
  },
  input_events: {
    label: "Inputs",
    color: "hsl(var(--chart-2))",
  },
  visit_events: {
    label: "Visit",
    color: "hsl(var(--chart-3))",
  },
  custom_events: {
    label: "Custom",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

type AnalyticsChartPoint = {
  createdAt: string;
  metricType?: string;
};

interface AnalyticsChartProps {
  title: string;
  description: string;
  metrics: string[];
  data?: AnalyticsChartPoint[];
  loading: boolean;
  windowDays?: number;
  endDate?: Date;
}

const toUtcMidnightDate = (value: string | number) => {
  if (!value) return undefined;
  const normalizedValue =
    typeof value === "string" && value.length === 10
      ? `${value}T00:00:00.000Z`
      : value;
  return new Date(normalizedValue);
};

const chooseTickStep = (windowDays: number) => {
  const targetTickCount = 7;
  const approx = Math.max(1, Math.ceil(windowDays / targetTickCount));
  const candidates = [1, 2, 3, 5, 7, 10, 14, 21, 28, 30, 45, 60, 90];
  const candidateStep = candidates.find((step) => step >= approx);
  return candidateStep ?? Math.max(approx, 30);
};

const AnalyticsChart = ({
  title,
  description,
  metrics,
  data = [],
  loading = false,
  windowDays = DEFAULT_CHART_WINDOW_DAYS,
  endDate,
}: AnalyticsChartProps) => {
  const { seriesData, axisTicks } = useMemo<{
    seriesData: Row[];
    axisTicks: string[];
  }>(() => {
    const buckets = new Map<string, Row>();

    data.forEach((ev) => {
      const day = new Date(ev.createdAt).toISOString().slice(0, 10);
      if (!buckets.has(day)) buckets.set(day, { date: day });

      const derivedMetric =
        typeof ev.metricType === "string" && metrics.includes(ev.metricType)
          ? ev.metricType
          : null;

      const targetMetrics =
        metrics.length === 1 ? metrics : derivedMetric ? [derivedMetric] : [];

      targetMetrics.forEach((metric) => {
        const row = buckets.get(day)!;
        const currentValue = row[metric];
        row[metric] = (typeof currentValue === "number" ? currentValue : 0) + 1;
      });
    });

    const windowSize =
      typeof windowDays === "number" && windowDays > 0
        ? windowDays
        : DEFAULT_CHART_WINDOW_DAYS;

    const safeEndDate = endDate ?? new Date();
    const dateRange = getIsoDateRange(windowSize, safeEndDate);
    const tickStep = chooseTickStep(windowSize);
    const ticks = dateRange.filter(
      (_, index) => index % tickStep === 0 || index === dateRange.length - 1,
    );

    const filledRange = dateRange.map((date) => {
      const bucket = buckets.get(date);
      const row: Row = { date };
      metrics.forEach((metric) => {
        const value = bucket?.[metric];
        row[metric] = typeof value === "number" ? value : 0;
      });
      return row;
    });

    return {
      seriesData: filledRange,
      axisTicks: ticks,
    };
  }, [data, metrics, windowDays, endDate]);

  const axisLabelFormatter = useCallback(
    (value: string | number) => {
      const date = toUtcMidnightDate(value);
      if (!date || Number.isNaN(date.getTime())) return "";

      if (windowDays <= 10) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        });
      }

      if (windowDays <= 31) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        });
      }

      if (windowDays <= 90) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        });
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
    },
    [windowDays],
  );

  const tooltipLabelFormatter = useCallback((value: string | number) => {
    const date = toUtcMidnightDate(value);
    if (!date || Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }, []);

  if (loading) {
    return (
      <Card className="relative w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex w-full items-center justify-center h-[20rem] w-full items-center justify-center">
          <ChartContainer config={chartConfig} className="h-[20rem] w-full">
            <div
              className="absolute flex flex-col"
              style={{
                left: "12px",
                right: "12px",
                top: "12px",
                bottom: "0px",
              }}
            >
              <div className="flex items-end justify-between gap-2 flex-1 pb-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${Math.random() * 30 + 10}%`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }
  if (!data || data.length === 0) {
    return (
      <Card className="relative w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="relative h-[20rem] w-full"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-muted-foreground">No data available</div>
            </div>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[20rem] w-full">
          <AreaChart
            accessibilityLayer
            data={seriesData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={axisTicks}
              tickFormatter={axisLabelFormatter}
            />
            <ChartTooltip
              cursor={false}
              labelFormatter={tooltipLabelFormatter}
              content={<ChartTooltipContent indicator="dot" />}
            />
            {metrics.map((metric) => (
              <Area
                key={metric}
                dataKey={metric}
                type="monotone"
                fill={`var(--color-${metric})`}
                fillOpacity={0.4}
                stroke={`var(--color-${metric})`}
                stackId={metrics.length > 1 ? undefined : "a"}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
