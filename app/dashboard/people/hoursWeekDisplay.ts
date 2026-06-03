import { formatHoursMinutes } from "./formatDuration";

export type HoursWeekStatus = "green" | "yellow" | "red";

export type HoursWeekDisplay = {
  label: string;
  status: HoursWeekStatus;
  title: string;
};

/** Monday = 1 … Sunday = 7 (days elapsed in the current week). */
export function getDaysElapsedInWeek(referenceDate: Date) {
  const day = referenceDate.getDay();
  return ((day + 6) % 7) + 1;
}

function getHoursPerDayStatus(avgHoursPerDay: number): HoursWeekStatus {
  if (avgHoursPerDay > 8) {
    return "green";
  }
  if (avgHoursPerDay >= 5) {
    return "yellow";
  }
  return "red";
}

/** Compute on the server to avoid hydration mismatches. */
export function getHoursWeekDisplay(
  totalHoursThisWeek: number,
  referenceDate: Date = new Date()
): HoursWeekDisplay | null {
  if (totalHoursThisWeek <= 0) {
    return null;
  }

  const daysElapsed = getDaysElapsedInWeek(referenceDate);
  const avgHoursPerDay = totalHoursThisWeek / daysElapsed;
  const status = getHoursPerDayStatus(avgHoursPerDay);

  const label = formatHoursMinutes(totalHoursThisWeek);

  return {
    label,
    status,
    title: `${label} this week`,
  };
}
