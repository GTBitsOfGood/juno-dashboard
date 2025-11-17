"use client";

import AnalyticsChart from "@/components/charts/AnalyticsChart";
import { Button } from "@/components/ui/button";
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
import { Event, EventMetric } from "./types";

interface SimpleEventsSectionProps {
  filteredAllEvents: Event[];
  filteredClickEvents: Event[];
  filteredInputEvents: Event[];
  filteredVisitEvents: Event[];
  eventsLoading: boolean;
  windowDays: number;
  endDate: Date;
  rangeLabel: string;
  onWindowChange: (value: string) => void;
  onGoOlder: () => void;
  onGoNewer: () => void;
  canGoOlder: boolean;
  canGoNewer: boolean;
  timeWindowOptions: readonly number[];
}

const SimpleEventsSection = ({
  filteredAllEvents,
  filteredClickEvents,
  filteredInputEvents,
  filteredVisitEvents,
  eventsLoading,
  windowDays,
  endDate,
  rangeLabel,
  onWindowChange,
  onGoOlder,
  onGoNewer,
  canGoOlder,
  canGoNewer,
  timeWindowOptions,
}: SimpleEventsSectionProps) => {
  const aggregateEventMetrics: EventMetric[] = [
    "click_events",
    "input_events",
    "visit_events",
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAllEvents.length} simple events
        </p>
        <div className="flex gap-2 flex-wrap">
          <Select value={String(windowDays)} onValueChange={onWindowChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time window" />
            </SelectTrigger>
            <SelectContent>
              {timeWindowOptions.map((days) => (
                <SelectItem key={days} value={String(days)}>
                  {days} days
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onGoNewer}
                    disabled={!canGoNewer}
                  >
                    Newer
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Show more recent events</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onGoOlder}
                    disabled={!canGoOlder}
                  >
                    Older
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Show older events</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <AnalyticsChart
          title="All Simple Event Types"
          description={`Click, input, and visit events over time · ${rangeLabel}`}
          metrics={aggregateEventMetrics}
          data={filteredAllEvents}
          loading={eventsLoading}
          windowDays={windowDays}
          endDate={endDate}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnalyticsChart
            title="Click Events"
            description="Click events over time"
            metrics={["click_events"]}
            data={filteredClickEvents}
            loading={eventsLoading}
            windowDays={windowDays}
            endDate={endDate}
          />
          <AnalyticsChart
            title="Input Events"
            description="Input events over time"
            metrics={["input_events"]}
            data={filteredInputEvents}
            loading={eventsLoading}
            windowDays={windowDays}
            endDate={endDate}
          />
          <AnalyticsChart
            title="Visit Events"
            description="Visit events over time"
            metrics={["visit_events"]}
            data={filteredVisitEvents}
            loading={eventsLoading}
            windowDays={windowDays}
            endDate={endDate}
          />
        </div>
      </div>
    </div>
  );
};

export default SimpleEventsSection;
