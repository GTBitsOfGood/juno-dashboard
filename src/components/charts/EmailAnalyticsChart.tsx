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
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const EmailAnalyticsChart = () => {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={emailData.responses}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="clicks"
              type="natural"
              fill="var(--color-clicks)"
              fillOpacity={0.4}
              stroke="var(--color-clicks)"
              stackId="a"
            />
            <Area
              dataKey="delivered"
              type="natural"
              fill="var(--color-delivered)"
              fillOpacity={0.4}
              stroke="var(--color-delivered)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const emailData = {
  responses: [
    {
      date: "2025-01-01",
      clicks: 0,
      unique_clicks: 0,
      opens: 1,
      unique_opens: 1,
      blocks: 0,
      bounce_drops: 0,
      bounces: 0,
      deferred: 0,
      delivered: 1,
      invalid_emails: 0,
      processed: 1,
      requests: 1,
      spam_report_drops: 0,
      spam_reports: 0,
      unsubscribe_drops: 0,
      unsubscribes: 0,
    },
    {
      date: "2025-01-02",
      clicks: 7,
      unique_clicks: 4,
      opens: 10,
      unique_opens: 6,
      blocks: 0,
      bounce_drops: 0,
      bounces: 0,
      deferred: 0,
      delivered: 6,
      invalid_emails: 0,
      processed: 6,
      requests: 6,
      spam_report_drops: 0,
      spam_reports: 0,
      unsubscribe_drops: 0,
      unsubscribes: 0,
    },
    {
      date: "2025-01-03",
      clicks: 7,
      unique_clicks: 6,
      opens: 7,
      unique_opens: 4,
      blocks: 0,
      bounce_drops: 0,
      bounces: 0,
      deferred: 0,
      delivered: 8,
      invalid_emails: 0,
      processed: 8,
      requests: 8,
      spam_report_drops: 0,
      spam_reports: 0,
      unsubscribe_drops: 0,
      unsubscribes: 0,
    },
    {
      date: "2025-01-04",
      clicks: 3,
      unique_clicks: 2,
      opens: 2,
      unique_opens: 2,
      blocks: 0,
      bounce_drops: 0,
      bounces: 0,
      deferred: 0,
      delivered: 7,
      invalid_emails: 0,
      processed: 7,
      requests: 7,
      spam_report_drops: 0,
      spam_reports: 0,
      unsubscribe_drops: 0,
      unsubscribes: 0,
    },
    {
      date: "2025-01-05",
      clicks: 13,
      unique_clicks: 13,
      opens: 16,
      unique_opens: 11,
      blocks: 0,
      bounce_drops: 0,
      bounces: 0,
      deferred: 0,
      delivered: 33,
      invalid_emails: 0,
      processed: 33,
      requests: 33,
      spam_report_drops: 0,
      spam_reports: 0,
      unsubscribe_drops: 0,
      unsubscribes: 0,
    },
    {
      date: "2025-01-06",
      clicks: 12,
      unique_clicks: 12,
      opens: 28,
      unique_opens: 13,
      blocks: 0,
      bounce_drops: 0,
      bounces: 0,
      deferred: 0,
      delivered: 26,
      invalid_emails: 0,
      processed: 26,
      requests: 26,
      spam_report_drops: 0,
      spam_reports: 0,
      unsubscribe_drops: 0,
      unsubscribes: 0,
    },
    {
      date: "2025-01-07",
      clicks: 12,
      unique_clicks: 12,
      opens: 17,
      unique_opens: 6,
      blocks: 0,
      bounce_drops: 0,
      bounces: 0,
      deferred: 0,
      delivered: 16,
      invalid_emails: 0,
      processed: 16,
      requests: 16,
      spam_report_drops: 0,
      spam_reports: 0,
      unsubscribe_drops: 0,
      unsubscribes: 0,
    },
    {
      date: "2025-01-08",
      clicks: 1,
      unique_clicks: 1,
      opens: 3,
      unique_opens: 2,
      blocks: 0,
      bounce_drops: 0,
      bounces: 0,
      deferred: 0,
      delivered: 5,
      invalid_emails: 0,
      processed: 5,
      requests: 5,
      spam_report_drops: 0,
      spam_reports: 0,
      unsubscribe_drops: 0,
      unsubscribes: 0,
    },
    {
      date: "2025-01-09",
      clicks: 5,
      unique_clicks: 3,
      opens: 4,
      unique_opens: 0,
      blocks: 0,
      bounce_drops: 0,
      bounces: 0,
      deferred: 0,
      delivered: 3,
      invalid_emails: 0,
      processed: 3,
      requests: 3,
      spam_report_drops: 0,
      spam_reports: 0,
      unsubscribe_drops: 0,
      unsubscribes: 0,
    },
    {
      date: "2025-01-10",
      clicks: 4,
      unique_clicks: 4,
      opens: 11,
      unique_opens: 6,
      blocks: 0,
      bounce_drops: 0,
      bounces: 0,
      deferred: 0,
      delivered: 5,
      invalid_emails: 0,
      processed: 5,
      requests: 5,
      spam_report_drops: 0,
      spam_reports: 0,
      unsubscribe_drops: 0,
      unsubscribes: 0,
    },
  ],
};

export default EmailAnalyticsChart;
