import { z } from "zod";

import type { EmployeeFormErrors } from "./people.types";

export const CreateEmployeeSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  email: z
    .string()
    .trim()
    .refine((value) => value === "" || z.email().safeParse(value).success, {
      message: "Enter a valid email.",
    }),
  phone: z.string().trim().optional(),
  role: z.string().trim().optional(),
});

export const UpdateEmployeeSchema = CreateEmployeeSchema.extend({
  id: z.string().trim().min(1, "Employee id is required."),
});

export function getEmployeeFieldErrors(error: z.ZodError): EmployeeFormErrors {
  const fieldErrors: EmployeeFormErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string") continue;
    const existing = fieldErrors[key as keyof EmployeeFormErrors] ?? [];
    fieldErrors[key as keyof EmployeeFormErrors] = [...existing, issue.message];
  }

  return fieldErrors;
}

export function readEmployeeCreateInput(formData: FormData) {
  return CreateEmployeeSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    role: formData.get("role"),
  });
}

export function readEmployeeUpdateInput(formData: FormData) {
  return UpdateEmployeeSchema.safeParse({
    id: formData.get("id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    role: formData.get("role"),
  });
}
