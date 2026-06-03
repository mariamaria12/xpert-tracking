import { z } from "zod";

import type { TimesheetFormErrors } from "./timesheet.types";

export const TimesheetSchema = z.object({
  employeeId: z.string().trim().min(1, "Employee is required."),
  projectId: z.string().trim().min(1, "Project is required."),
  startedAt: z.string().trim().min(1, "Start time is required."),
  endedAt: z.string().trim().optional(),
  activity: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const UpdateTimesheetSchema = TimesheetSchema.extend({
  id: z.string().trim().min(1, "Timesheet id is required."),
});

export function getTimesheetFieldErrors(error: z.ZodError): TimesheetFormErrors {
  const fieldErrors: TimesheetFormErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string") {
      continue;
    }
    const existing = fieldErrors[key as keyof TimesheetFormErrors] ?? [];
    fieldErrors[key as keyof TimesheetFormErrors] = [...existing, issue.message];
  }

  return fieldErrors;
}

export function readTimesheetCreateInput(formData: FormData) {
  return TimesheetSchema.safeParse({
    employeeId: formData.get("employeeId"),
    projectId: formData.get("projectId"),
    startedAt: formData.get("startedAt"),
    endedAt: formData.get("endedAt"),
    activity: formData.get("activity"),
    notes: formData.get("notes"),
  });
}

export function readTimesheetUpdateInput(formData: FormData) {
  return UpdateTimesheetSchema.safeParse({
    id: formData.get("id"),
    employeeId: formData.get("employeeId"),
    projectId: formData.get("projectId"),
    startedAt: formData.get("startedAt"),
    endedAt: formData.get("endedAt"),
    activity: formData.get("activity"),
    notes: formData.get("notes"),
  });
}

export function parseDateTimeLocal(value: string) {
  // `datetime-local` submits `YYYY-MM-DDTHH:mm` (no timezone).
  // Parsing via `new Date(value)` can vary by runtime; parse manually.
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }

  const [, y, m, d, hh, mm] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function computeDurationMinutes(startedAt: Date, endedAt: Date) {
  const diff = Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);
  return diff > 0 ? diff : null;
}
