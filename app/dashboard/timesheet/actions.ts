"use server";

import { auth } from "auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const TimesheetSchema = z.object({
  employeeId: z.string().trim().min(1, "Employee is required."),
  projectId: z.string().trim().min(1, "Project is required."),
  startedAt: z.string().trim().min(1, "Start time is required."),
  endedAt: z.string().trim().optional(),
  activity: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type TimesheetFormState =
  | {
      success?: boolean;
      message?: string;
      errors?: {
        employeeId?: string[];
        projectId?: string[];
        startedAt?: string[];
        endedAt?: string[];
        activity?: string[];
        notes?: string[];
        id?: string[];
      };
    }
  | undefined;

function parseDateTimeLocal(value: string) {
  // `datetime-local` submits `YYYY-MM-DDTHH:mm` (no timezone).
  // Parsing via `new Date(value)` can vary by runtime; parse manually.
  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const [, y, m, d, hh, mm] = match;
  const date = new Date(
    Number(y),
    Number(m) - 1,
    Number(d),
    Number(hh),
    Number(mm),
    0,
    0,
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

function computeDurationMinutes(startedAt: Date, endedAt: Date) {
  const diff = Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);
  return diff > 0 ? diff : null;
}

export async function createTimesheet(
  _prevState: TimesheetFormState,
  formData: FormData,
): Promise<TimesheetFormState> {
  const parsed = TimesheetSchema.safeParse({
    employeeId: formData.get("employeeId"),
    projectId: formData.get("projectId"),
    startedAt: formData.get("startedAt"),
    endedAt: formData.get("endedAt"),
    activity: formData.get("activity"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const session = await auth();
  let createdBy = session?.user?.id;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!createdBy) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    createdBy = user?.id;
  }

  if (!createdBy) {
    return { message: "You must be signed in to add time logs." };
  }

  const { employeeId, projectId, startedAt, endedAt, activity, notes } = parsed.data;

  const started = parseDateTimeLocal(startedAt);
  const ended = endedAt ? parseDateTimeLocal(endedAt) : null;

  if (!started) {
    return { errors: { startedAt: ["Enter a valid start time."] } };
  }
  if (endedAt && !ended) {
    return { errors: { endedAt: ["Enter a valid end time."] } };
  }

  const durationMinutes = ended ? computeDurationMinutes(started, ended) : null;

  const { error } = await supabase.from("time_logs").insert({
    employee_id: employeeId,
    project_id: projectId,
    started_at: started.toISOString(),
    ended_at: ended ? ended.toISOString() : null,
    duration_minutes: durationMinutes,
    activity: activity || null,
    notes: notes || null,
    created_by: createdBy,
  });

  if (error) {
    console.error("Failed to create time log:", error);
    return { message: error.message };
  }

  revalidatePath("/dashboard/timesheet");
  return { success: true };
}

const UpdateTimesheetSchema = TimesheetSchema.extend({
  id: z.string().trim().min(1, "Timesheet id is required."),
});

export async function updateTimesheet(
  _prevState: TimesheetFormState,
  formData: FormData,
): Promise<TimesheetFormState> {
  const parsed = UpdateTimesheetSchema.safeParse({
    id: formData.get("id"),
    employeeId: formData.get("employeeId"),
    projectId: formData.get("projectId"),
    startedAt: formData.get("startedAt"),
    endedAt: formData.get("endedAt"),
    activity: formData.get("activity"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { id, employeeId, projectId, startedAt, endedAt, activity, notes } = parsed.data;

  const started = parseDateTimeLocal(startedAt);
  const ended = endedAt ? parseDateTimeLocal(endedAt) : null;

  if (!started) {
    return { errors: { startedAt: ["Enter a valid start time."] } };
  }
  if (endedAt && !ended) {
    return { errors: { endedAt: ["Enter a valid end time."] } };
  }

  const durationMinutes = ended ? computeDurationMinutes(started, ended) : null;

  const { error } = await supabase
    .from("time_logs")
    .update({
      employee_id: employeeId,
      project_id: projectId,
      started_at: started.toISOString(),
      ended_at: ended ? ended.toISOString() : null,
      duration_minutes: durationMinutes,
      activity: activity || null,
      notes: notes || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update time log:", error);
    return { message: error.message };
  }

  revalidatePath("/dashboard/timesheet");
  return { success: true };
}

