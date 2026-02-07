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

const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "hsl(var(--chart-1))",
  },
  opens: {
    label: "Opens",
    color: "hsl(var(--chart-2))",
  },
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-3))",
  },
  bounces: {
    label: "Bounces",
    color: "hsl(var(--chart-4))",
  },
  processed: {
    label: "Processed",
    color: "hsl(var(--chart-5))",
  },
  deferred: {
    label: "Deferred",
    color: "hsl(var(--chart-6))",
  },
  spam_reports: {
    label: "spam_reports",
    color: "hsl(var(--chart-7))",
  },
  unsubscribes: {
    label: "unsubscribes",
    color: "hsl(var(--chart-8))",
  },
} satisfies ChartConfig;

interface EmailAnalyticsData {
  blocks: number;
  bounce_drops: number;
  bounces: number;
  clicks: number;
  date: string;
  deferred: number;
  delivered: number;
  invalid_emails: number;
  opens: number;
  processed: number;
  requests: number;
  spam_report_drops: number;
  spam_reports: number;
  unique_clicks: number;
  unique_opens: number;
  unsubscribe_drops: number;
  unsubscribes: number;
}

interface EmailAnalyticsChartProps {
  projectId: string;
  title: string;
  description: string;
  metrics: string[];
  data?: EmailAnalyticsData[];
  loading?: boolean;
}

const EmailAnalyticsChart = ({
  title,
  description,
  metrics,
  data = [],
  loading = false,
}: EmailAnalyticsChartProps) => {
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
            data={data}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                });
              }}
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

export default EmailAnalyticsChart;
