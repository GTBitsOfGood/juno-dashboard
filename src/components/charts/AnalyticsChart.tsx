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

import { useMemo } from "react";

import { DEFAULT_CHART_WINDOW_DAYS, getIsoDateRange } from "@/lib/date-range";

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
}

const toUtcMidnightDate = (value: string | number) => {
  if (!value) return undefined;
  const normalizedValue =
    typeof value === "string" && value.length === 10
      ? `${value}T00:00:00.000Z`
      : value;
  return new Date(normalizedValue);
};

const formatDateLabel = (value: string | number) => {
  const date = toUtcMidnightDate(value);
  if (!date || Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });
};

const AnalyticsChart = ({
  title,
  description,
  metrics,
  data = [],
  loading = false,
  windowDays = DEFAULT_CHART_WINDOW_DAYS,
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

    const dateRange = getIsoDateRange(windowSize);
    const ticks = dateRange.filter(
      (_, index) => index % 5 === 0 || index === dateRange.length - 1
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
  }, [data, metrics, windowDays]);

  if (loading) {
    return (
      <Card className="relative w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-muted-foreground">Loading analytics...</div>
          </div>
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
          <div className="h-64 flex items-center justify-center">
            <div className="text-muted-foreground">No data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[26rem] w-full">
          <AreaChart
            accessibilityLayer
            data={seriesData}
            margin={{
              left: 0,
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
              tickFormatter={formatDateLabel}
            />
            <ChartTooltip
              cursor={false}
              labelFormatter={formatDateLabel}
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
