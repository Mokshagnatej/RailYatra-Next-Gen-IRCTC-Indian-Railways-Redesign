/**
 * dateUtils.ts - Dynamic date calculation and formatting utilities for RailYatra.
 * Ensures all dates across search strips, forecasts, quick tools, and booking tickets
 * update automatically based on the current live day.
 */

export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Returns a new Date object offset by `offsetDays` from the base date.
 */
export function getRelativeDate(offsetDays: number, baseDate: Date = new Date()): Date {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + offsetDays);
  return d;
}

/**
 * Formats a date as short format: "27 Aug", "01 Sep"
 */
export function formatDateShort(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTHS_SHORT[date.getMonth()];
  return `${day} ${month}`;
}

/**
 * Formats a date as hyphenated standard format: "27-Aug-2026"
 */
export function formatDateMedium(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTHS_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Formats a date as full display format: "Thu, 27 Aug 2026"
 */
export function formatDateLong(date: Date = new Date()): string {
  const dayName = DAYS_SHORT[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTHS_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
}

/**
 * Formats a date as "27 Aug 2026"
 */
export function formatDateDisplay(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTHS_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Returns the short day of week: "Thu", "Fri", etc.
 */
export function getDayName(date: Date = new Date()): string {
  return DAYS_SHORT[date.getDay()] ?? "Sun";
}

export interface DateStripData {
  dates: string[];
  dayNames: Record<string, string>;
  fullDates: Record<string, string>;
  availabilityHint: Record<string, "green" | "amber" | "red">;
  todayShort: string;
  todayMedium: string;
  todayLong: string;
}

/**
 * Generates dynamic 10-day date strip data starting from today.
 */
export function getDateStrip(count: number = 10, startDate: Date = new Date()): DateStripData {
  const dates: string[] = [];
  const dayNames: Record<string, string> = {};
  const fullDates: Record<string, string> = {};
  const availabilityHint: Record<string, "green" | "amber" | "red"> = {};

  const hintsPattern: Array<"green" | "amber" | "red"> = [
    "green", "amber", "green", "green", "red", "green", "amber", "green", "green", "amber"
  ];

  for (let i = 0; i < count; i++) {
    const d = getRelativeDate(i, startDate);
    const shortStr = formatDateShort(d);
    const medStr = formatDateMedium(d);
    const day = getDayName(d);

    dates.push(shortStr);
    dayNames[shortStr] = day;
    fullDates[shortStr] = medStr;
    availabilityHint[shortStr] = hintsPattern[i % hintsPattern.length] ?? "green";
  }

  const firstDate = dates[0] ?? formatDateShort(startDate);
  return {
    dates,
    dayNames,
    fullDates,
    availabilityHint,
    todayShort: firstDate,
    todayMedium: fullDates[firstDate] ?? formatDateMedium(startDate),
    todayLong: formatDateLong(startDate),
  };
}

export interface QuickDateItem {
  label: string;
  value: string;
  dateStr: string;
  day: string;
  shortDate: string;
}

/**
 * Generates quick select dates (Today, Tomorrow, 3rd day, etc.)
 */
export function getQuickDates(count: number = 7, startDate: Date = new Date()): QuickDateItem[] {
  const items: QuickDateItem[] = [];

  for (let i = 0; i < count; i++) {
    const d = getRelativeDate(i, startDate);
    const shortDate = formatDateShort(d);
    const medStr = formatDateMedium(d);
    const day = getDayName(d);

    let label = shortDate;
    if (i === 0) label = "Today";
    else if (i === 1) label = "Tomorrow";

    items.push({
      label,
      value: medStr,
      dateStr: medStr,
      day,
      shortDate
    });
  }

  return items;
}

export interface SeatForecastItem {
  date: string;
  d: string;
  day: string;
  status: string;
  color: string;
  hexColor: string;
}

/**
 * Generates realistic 6-day availability forecast starting from a date.
 */
export function getSeatForecast(count: number = 6, startDate: Date = new Date()): SeatForecastItem[] {
  const statuses = [
    { status: "AVAILABLE 28", color: "text-emerald-700 bg-emerald-50 border-emerald-200", hexColor: "#1F7A4C" },
    { status: "AVAILABLE 42", color: "text-emerald-700 bg-emerald-50 border-emerald-200", hexColor: "#1F7A4C" },
    { status: "AVAILABLE 54", color: "text-emerald-700 bg-emerald-50 border-emerald-200", hexColor: "#1F7A4C" },
    { status: "RAC 8", color: "text-amber-700 bg-amber-50 border-amber-200", hexColor: "#C97F1F" },
    { status: "AVAILABLE 16", color: "text-emerald-700 bg-emerald-50 border-emerald-200", hexColor: "#1F7A4C" },
    { status: "WL 12", color: "text-rose-700 bg-rose-50 border-rose-200", hexColor: "#C23B32" },
    { status: "AVAILABLE 34", color: "text-emerald-700 bg-emerald-50 border-emerald-200", hexColor: "#1F7A4C" },
  ];

  const items: SeatForecastItem[] = [];

  for (let i = 0; i < count; i++) {
    const d = getRelativeDate(i, startDate);
    const shortDate = formatDateShort(d);
    const day = getDayName(d);
    const st = statuses[i % statuses.length] ?? {
      status: "AVAILABLE 28",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      hexColor: "#1F7A4C"
    };

    items.push({
      date: `${shortDate.replace(' ', '-')}`,
      d: shortDate,
      day,
      status: st.status,
      color: st.color,
      hexColor: st.hexColor
    });
  }

  return items;
}
