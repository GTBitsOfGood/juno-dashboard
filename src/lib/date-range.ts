export const DEFAULT_CHART_WINDOW_DAYS = 30;

/**
 * Returns an array of ISO date strings (yyyy-mm-dd) that covers a window
 * ending on `endDate` and going back `days` days (inclusive).
 */
export const getIsoDateRange = (
  days = DEFAULT_CHART_WINDOW_DAYS,
  endDate: Date = new Date(),
): string[] => {
  if (days <= 0) {
    return [];
  }

  const normalizedEndDate = new Date(endDate);
  normalizedEndDate.setUTCHours(0, 0, 0, 0);

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(normalizedEndDate);
    const offset = days - 1 - index;
    date.setUTCDate(normalizedEndDate.getUTCDate() - offset);
    return date.toISOString().slice(0, 10);
  });
};
