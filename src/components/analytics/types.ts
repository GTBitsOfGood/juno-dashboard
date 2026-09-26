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
