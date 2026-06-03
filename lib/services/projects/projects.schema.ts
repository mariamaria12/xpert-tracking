import { z } from "zod";

import { PROJECT_STATUSES } from "./projectStatuses";

import type { ProjectFormErrors } from "./projects.types";

export const ProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required."),
  clientId: z.string().trim().min(1, "Client is required."),
  status: z.enum(PROJECT_STATUSES, { error: "Select a valid status." }),
  estimatedHours: z.string().trim().optional(),
  dueDate: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

export const UpdateProjectSchema = ProjectSchema.extend({
  id: z.string().trim().min(1, "Project id is required."),
});

export function getProjectFieldErrors(error: z.ZodError): ProjectFormErrors {
  const fieldErrors: ProjectFormErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string") {
      continue;
    }
    const existing = fieldErrors[key as keyof ProjectFormErrors] ?? [];
    fieldErrors[key as keyof ProjectFormErrors] = [...existing, issue.message];
  }

  return fieldErrors;
}

export function readProjectCreateInput(formData: FormData) {
  return ProjectSchema.safeParse({
    name: formData.get("name"),
    clientId: formData.get("clientId"),
    status: formData.get("status"),
    estimatedHours: formData.get("estimatedHours"),
    dueDate: formData.get("dueDate"),
    description: formData.get("description"),
  });
}

export function readProjectUpdateInput(formData: FormData) {
  return UpdateProjectSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    clientId: formData.get("clientId"),
    status: formData.get("status"),
    estimatedHours: formData.get("estimatedHours"),
    dueDate: formData.get("dueDate"),
    description: formData.get("description"),
  });
}

export function parseEstimatedHours(value: string | undefined) {
  if (!value?.trim()) {
    return null;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function parseDueDate(value: string | undefined) {
  if (!value?.trim()) {
    return null;
  }
  return /^\d{4}-\d{2}-\d{2}$/.test(value.trim()) ? value.trim() : null;
}
