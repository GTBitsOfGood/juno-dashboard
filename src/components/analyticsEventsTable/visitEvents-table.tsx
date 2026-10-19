"use client";

import { Event } from "@/components/analytics/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVisitEventsPaginated } from "@/lib/settings";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChartColumn, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BaseTable } from "../baseTable";
import { Alert } from "../ui/alert";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { visitEventColumns } from "./columns";

interface VisitEventsTableProps {
  projectId: string;
  projectName: string;
}

export function VisitEventsTable({
  projectId,
  projectName,
}: VisitEventsTableProps) {
  const [pageSize, setPageSize] = useState(10);
  const [cursors, setCursors] = useState<string[]>([""]);
  const pageIndex = cursors.length - 1;
  const currentCursor = cursors[pageIndex];

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "visitEventsPage",
      projectId,
      projectName,
      currentCursor,
      pageSize,
    ],
    queryFn: () =>
      getVisitEventsPaginated(projectName, projectId, {
        afterId: currentCursor || undefined,
        limit: pageSize,
      }),
    enabled: !!projectName,
    placeholderData: keepPreviousData,
  });

  const events: Event[] = data?.events ?? [];
  const nextCursor = data?.afterId ?? "";
  const hasError = isError || data?.success === false;

  useEffect(() => {
    if (hasError) {
      toast.error("Error", {
        description: `Failed to fetch visit events: ${data?.error ?? "Unknown error"}`,
      });
    }
  }, [hasError, data?.error]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold">Visit Events</h1>
      {hasError && (
        <Alert variant="destructive">
          <CircleX className="h-4 w-4" />
          <span className="text-sm">
            Couldn&apos;t load visit events: {data?.error ?? "Unknown error"}
          </span>
        </Alert>
      )}
      {hasError ? null : !isLoading &&
        pageIndex === 0 &&
        events.length === 0 ? (
        <Card className="max-w-full sm:max-w-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ChartColumn className="h-5 w-5 text-muted-foreground" />
              <CardTitle>No Visit Events</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Project {projectId} hasn&apos;t logged any visit events yet.
              They&apos;ll appear here once your app starts sending them.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <BaseTable
            columns={visitEventColumns}
            data={events}
            isLoading={isLoading}
          />
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page
              </span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCursors([""]);
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCursors([""])}
                disabled={pageIndex === 0}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCursors((previous) => previous.slice(0, -1))}
                disabled={pageIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCursors((previous) => [...previous, nextCursor])
                }
                disabled={!nextCursor || events.length === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
