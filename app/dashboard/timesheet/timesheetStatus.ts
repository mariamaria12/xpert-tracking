export type TimesheetStatus = "InProgress" | "Break" | "Completed";

export type TimesheetStatusDisplay = {
  status: TimesheetStatus;
  label: string;
};

const STATUS_LABELS: Record<TimesheetStatus, string> = {
  InProgress: "In progress",
  Break: "Break",
  Completed: "Completed",
};

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameCalendarDay(a: Date, b: Date) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

/** 5:00 PM on the given calendar day (local time). */
function endOfWorkDay(date: Date) {
  const d = startOfDay(date);
  d.setHours(17, 0, 0, 0);
  return d;
}

/**
 * - InProgress: no end time recorded yet
 * - Break: ended for the day, but before 5pm on the work day
 * - Completed: ended and it's 5pm or later on the work day, or the work day is in the past
 */
export function getTimesheetStatus(
  startedAt: Date,
  endedAt: Date | null,
  referenceDate: Date = new Date(),
): TimesheetStatus {
  if (!endedAt) {
    return "InProgress";
  }

  const workDay = startedAt;

  if (!isSameCalendarDay(workDay, referenceDate)) {
    return "Completed";
  }

  if (referenceDate.getTime() < endOfWorkDay(workDay).getTime()) {
    return "Break";
  }

  return "Completed";
}

export function getTimesheetStatusDisplay(
  startedAtIso: string,
  endedAtIso: string | null,
  referenceDate: Date = new Date(),
): TimesheetStatusDisplay | null {
  const startedAt = new Date(startedAtIso);
  if (Number.isNaN(startedAt.getTime())) return null;

  const endedAt = endedAtIso ? new Date(endedAtIso) : null;
  if (endedAt && Number.isNaN(endedAt.getTime())) return null;

  const status = getTimesheetStatus(startedAt, endedAt, referenceDate);

  return {
    status,
    label: STATUS_LABELS[status],
  };
}
