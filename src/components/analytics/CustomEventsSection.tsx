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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomEventType, Event } from "./types";

interface CustomEventsSectionProps {
  filteredCustomEvents: Event[];
  customEventsLoading: boolean;
  windowDays: number;
  endDate: Date;
  rangeLabel: string;
  selectedCategory: string;
  selectedSubcategory: string;
  categoryOptions: string[];
  subcategoryOptions: string[];
  currentEventType?: CustomEventType;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onWindowChange: (value: string) => void;
  onGoOlder: () => void;
  onGoNewer: () => void;
  canGoOlder: boolean;
  canGoNewer: boolean;
  timeWindowOptions: readonly number[];
  hasCustomOptions: boolean;
}

const CustomEventsSection = ({
  filteredCustomEvents,
  customEventsLoading,
  windowDays,
  endDate,
  rangeLabel,
  selectedCategory,
  selectedSubcategory,
  categoryOptions,
  subcategoryOptions,
  currentEventType,
  onCategoryChange,
  onSubcategoryChange,
  onWindowChange,
  onGoOlder,
  onGoNewer,
  canGoOlder,
  canGoNewer,
  timeWindowOptions,
  hasCustomOptions,
}: CustomEventsSectionProps) => {
  const customChartDescription =
    selectedCategory && selectedSubcategory
      ? `Custom events captured for ${selectedCategory} / ${selectedSubcategory} · ${rangeLabel}`
      : `Custom events over time · ${rangeLabel}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {hasCustomOptions
            ? `Showing ${filteredCustomEvents.length} custom events`
            : "No custom event types configured"}
        </p>
        {hasCustomOptions && selectedCategory && (
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions
                  .filter((cat) => cat !== "")
                  .map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedSubcategory}
              onValueChange={onSubcategoryChange}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subcategoryOptions
                  .filter((sub) => sub !== "")
                  .map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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
        )}
      </div>

      {hasCustomOptions && (
        <>
          <AnalyticsChart
            title={`${selectedCategory} / ${selectedSubcategory}`}
            description={customChartDescription}
            metrics={["custom_events"]}
            data={filteredCustomEvents}
            loading={customEventsLoading}
            windowDays={windowDays}
            endDate={endDate}
          />

          {currentEventType && currentEventType.properties.length > 0 && (
            <div className="rounded-lg border border-border/60 bg-card p-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">Event Properties</h3>
                <div className="flex flex-wrap gap-2">
                  {currentEventType.properties.map((property) => (
                    <span
                      key={property}
                      className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                    >
                      {property}
                    </span>
                  ))}
                </div>
              </div>

              {filteredCustomEvents.length > 0 && (
                <div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">Timestamp</TableHead>
                          {currentEventType.properties.map((property) => (
                            <TableHead key={property}>{property}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomEvents
                          .slice()
                          .sort(
                            (first, second) =>
                              new Date(second.createdAt).getTime() -
                              new Date(first.createdAt).getTime(),
                          )
                          .slice(0, 20)
                          .map((event) => (
                            <TableRow key={event.id}>
                              <TableCell className="font-mono text-xs">
                                {new Date(event.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </TableCell>
                              {currentEventType.properties.map((property) => (
                                <TableCell key={property} className="text-xs">
                                  {event.properties?.[property] ? (
                                    <span className="font-medium">
                                      {event.properties[property]}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground italic">
                                      —
                                    </span>
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomEventsSection;
