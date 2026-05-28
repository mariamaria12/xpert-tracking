"use server";

import { auth } from "auth";
import { revalidatePath } from "next/cache";
import {
  getEmployeeFieldErrors,
  readEmployeeCreateInput,
  readEmployeeUpdateInput,
} from "@/lib/services/people/people.schema";
import {
  createEmployeeRecord,
  updateEmployeeRecord,
} from "@/lib/services/people/people.service";
import type { EmployeeFormState } from "@/lib/services/people/people.types";

export async function createEmployee(
  _prevState: EmployeeFormState,
  formData: FormData,
): Promise<EmployeeFormState> {
  const parsed = readEmployeeCreateInput(formData);

  if (!parsed.success) {
    return { errors: getEmployeeFieldErrors(parsed.error) };
  }

  const session = await auth();
  const { error } = await createEmployeeRecord({
    input: parsed.data,
    createdBy: session?.user?.id,
  });

  if (error) {
    return { message: error };
  }

  revalidatePath("/dashboard/people");
  return { success: true };
}

export async function updateEmployee(
  _prevState: EmployeeFormState,
  formData: FormData,
): Promise<EmployeeFormState> {
  const parsed = readEmployeeUpdateInput(formData);

  if (!parsed.success) {
    return { errors: getEmployeeFieldErrors(parsed.error) };
  }

  const { error } = await updateEmployeeRecord({ input: parsed.data });

  if (error) {
    return { message: error };
  }

  revalidatePath("/dashboard/people");
  return { success: true };
}
