"use server";

import { revalidatePath } from "next/cache";

import { requireUserId } from "@/lib/auth/supabaseAuth";
import {
  getTimesheetFieldErrors,
  readTimesheetCreateInput,
  readTimesheetUpdateInput,
} from "@/lib/services/timesheet/timesheet.schema";
import {
  createTimesheetRecord,
  updateTimesheetRecord,
} from "@/lib/services/timesheet/timesheet.service";

import type { TimesheetFormState } from "@/lib/services/timesheet/timesheet.types";

export async function createTimesheet(
  _prevState: TimesheetFormState,
  formData: FormData
): Promise<TimesheetFormState> {
  const parsed = readTimesheetCreateInput(formData);

  if (!parsed.success) {
    return { errors: getTimesheetFieldErrors(parsed.error) };
  }

  const createdBy = await requireUserId();
  const result = await createTimesheetRecord({
    input: parsed.data,
    createdBy,
  });

  if (result.validationErrors) {
    return { errors: result.validationErrors };
  }

  if (result.error) {
    return { message: result.error };
  }

  revalidatePath("/dashboard/timesheet");
  return { success: true };
}

export async function updateTimesheet(
  _prevState: TimesheetFormState,
  formData: FormData
): Promise<TimesheetFormState> {
  const parsed = readTimesheetUpdateInput(formData);

  if (!parsed.success) {
    return { errors: getTimesheetFieldErrors(parsed.error) };
  }

  const result = await updateTimesheetRecord({ input: parsed.data });

  if (result.validationErrors) {
    return { errors: result.validationErrors };
  }

  if (result.error) {
    return { message: result.error };
  }

  revalidatePath("/dashboard/timesheet");
  return { success: true };
}
