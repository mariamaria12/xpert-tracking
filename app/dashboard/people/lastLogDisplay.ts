import { formatClockHoursMinutes } from "./formatDuration";

export type LastLogStatus = "green" | "yellow" | "red";

export type LastLogDisplay = {
  dayLabel: string;
  timeLabel: string;
  status: LastLogStatus;
  title: string;
};

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function calendarDaysBetween(lastLogDay: Date, today: Date) {
  return Math.floor(
    (startOfDay(today).getTime() - startOfDay(lastLogDay).getTime()) /
      (24 * 60 * 60 * 1000),
  );
}

/** True when every calendar day between last log and today is Sat/Sun (e.g. Fri → Mon). */
function isWeekendOnlyGap(lastLogDay: Date, today: Date) {
  let current = addDays(startOfDay(lastLogDay), 1);
  const end = startOfDay(today);

  if (current >= end) return false;

  while (current < end) {
    const weekday = current.getDay();
    if (weekday !== 0 && weekday !== 6) return false;
    current = addDays(current, 1);
  }

  return true;
}

function getLastLogStatus(lastLogDay: Date, today: Date): LastLogStatus {
  const diffDays = calendarDaysBetween(lastLogDay, today);

  if (diffDays === 0) return "green";
  if (diffDays <= 2) return "yellow";
  if (isWeekendOnlyGap(lastLogDay, today)) return "yellow";
  return "red";
}

function getDayLabel(lastLogAt: Date, diffDays: number) {
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(lastLogAt);
}

function getTimeLabel(lastLogAt: Date) {
  return formatClockHoursMinutes(lastLogAt);
}

/** Compute display fields once on the server to avoid hydration mismatches. */
export function getLastLogDisplay(
  value: string | null,
  referenceDate: Date = new Date(),
): LastLogDisplay | null {
  if (!value) return null;

  const lastLogAt = new Date(value);
  if (Number.isNaN(lastLogAt.getTime())) return null;

  const diffDays = calendarDaysBetween(lastLogAt, referenceDate);

  return {
    dayLabel: getDayLabel(lastLogAt, diffDays),
    timeLabel: getTimeLabel(lastLogAt),
    status: getLastLogStatus(lastLogAt, referenceDate),
    title: lastLogAt.toISOString(),
  };
}
