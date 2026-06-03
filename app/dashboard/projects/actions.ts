"use server";

import { revalidatePath } from "next/cache";

import {
  getProjectFieldErrors,
  readProjectCreateInput,
  readProjectUpdateInput,
} from "@/lib/services/projects/projects.schema";
import { createProjectRecord, updateProjectRecord } from "@/lib/services/projects/projects.service";

import type { ProjectFormState } from "@/lib/services/projects/projects.types";

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const parsed = readProjectCreateInput(formData);

  if (!parsed.success) {
    return { errors: getProjectFieldErrors(parsed.error) };
  }

  const result = await createProjectRecord({
    input: parsed.data,
  });

  if (result.validationErrors) {
    return { errors: result.validationErrors };
  }

  if (result.error) {
    return { message: result.error };
  }

  revalidatePath("/dashboard/projects");
  return { success: true };
}

export async function updateProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const parsed = readProjectUpdateInput(formData);

  if (!parsed.success) {
    return { errors: getProjectFieldErrors(parsed.error) };
  }

  const result = await updateProjectRecord({ input: parsed.data });

  if (result.validationErrors) {
    return { errors: result.validationErrors };
  }

  if (result.error) {
    return { message: result.error };
  }

  revalidatePath("/dashboard/projects");
  return { success: true };
}
