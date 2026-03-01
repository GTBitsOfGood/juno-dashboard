"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getJunoCounts } from "@/lib/sdkActions";
import { HeartPulse, Layers, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

// TODO: this needs to be pulled from juno db
const projectServiceData = [
  { service: "Email Service", onboardedProjects: 1 },
  { service: "File Service", onboardedProjects: 3 },
  { service: "Analytics Service", onboardedProjects: 4 },
];

// TODO: this needs to be pulled from bog-analytics
const dummyData = [
  { name: "Jan", emailService: 186, fileService: 80, analyticsService: 1823 },
  { name: "Feb", emailService: 305, fileService: 20, analyticsService: 1823 },
  { name: "Mar", emailService: 237, fileService: 12, analyticsService: 1235 },
  { name: "Apr", emailService: 73, fileService: 19, analyticsService: 1103 },
  { name: "May", emailService: 209, fileService: 13, analyticsService: 1934 },
  { name: "Jun", emailService: 214, fileService: 14, analyticsService: 1238 },
];

const barChartConfig = {
  onboardedProjects: {
    label: "Onboarded Projects",
  },
};

const chartConfig = {
  emailService: {
    label: "Email Service",
    color: "var(--chart-1)",
  },
  fileService: {
    label: "File Service",
    color: "var(--chart-2)",
  },
  analyticsService: {
    label: "Analytics Service",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const AdminPage = () => {
  useEffect(() => {
    async function fetchData() {
      try {
        const [counts] = await Promise.all([getJunoCounts()]);

        if (!counts.success) {
          console.error(`Failed to fetch project count: ${counts.error}`);
        }

        setProjectCount(counts.projectCount);
        setUserCount(counts.userCount);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const [projectCount, setProjectCount] = useState<number | null>(0);
  const [userCount, setUserCount] = useState<number | null>(0);
  const [loading, setLoading] = useState(true); // TODO: add skeleton load animations instead of loading

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Admin Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {projectCount ?? "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total projects on Juno
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{userCount ?? "N/A"}</div>
                <p className="text-xs text-muted-foreground">
                  Total users on Juno
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              Requests in the last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Service Health
            </CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">Percent uptime</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>API Requests</CardTitle>
            <CardDescription>API requests over time.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig}>
              <LineChart
                data={dummyData}
                margin={{
                  left: 12,
                  right: 12,
                }}
                accessibilityLayer
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="analyticsService"
                  activeDot={{ r: 8 }}
                />

                <Line
                  type="monotone"
                  dataKey="fileService"
                  activeDot={{ r: 8 }}
                />

                <Line
                  type="monotone"
                  dataKey="emailService"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Recent Juno events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">placeholder</div>
          </CardContent>
        </Card>

        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Projects Onboarded</CardTitle>
            <CardDescription>
              Number of projects using each service.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={barChartConfig}>
              <BarChart accessibilityLayer data={projectServiceData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="service"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="onboardedProjects" fill="#cdcdcd" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
