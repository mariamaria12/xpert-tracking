import { z } from "zod";

import type { ClientFormErrors } from "./clients.types";

export const ClientSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required."),
  industry: z.string().trim().optional(),
  contactPerson: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .refine((value) => value === "" || z.email().safeParse(value).success, {
      message: "Enter a valid email.",
    }),
  phone: z.string().trim().optional(),
  billingAddress: z.string().trim().optional(),
  deliveryAddress: z.string().trim().optional(),
  status: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const UpdateClientSchema = ClientSchema.extend({
  id: z.string().trim().min(1, "Client id is required."),
});

export function getClientFieldErrors(error: z.ZodError): ClientFormErrors {
  const fieldErrors: ClientFormErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string") {
      continue;
    }

    // Keep the output shape identical to Zod's `flatten().fieldErrors`,
    // but avoid relying on deprecated APIs.
    const existing = fieldErrors[key as keyof ClientFormErrors] ?? [];
    fieldErrors[key as keyof ClientFormErrors] = [...existing, issue.message];
  }

  return fieldErrors;
}

export function readClientCreateInput(formData: FormData) {
  return ClientSchema.safeParse({
    companyName: formData.get("companyName"),
    industry: formData.get("industry"),
    contactPerson: formData.get("contactPerson"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    billingAddress: formData.get("billingAddress"),
    deliveryAddress: formData.get("deliveryAddress"),
    status: formData.get("status"),
    notes: formData.get("notes"),
  });
}

export function readClientUpdateInput(formData: FormData) {
  return UpdateClientSchema.safeParse({
    id: formData.get("id"),
    companyName: formData.get("companyName"),
    industry: formData.get("industry"),
    contactPerson: formData.get("contactPerson"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    billingAddress: formData.get("billingAddress"),
    deliveryAddress: formData.get("deliveryAddress"),
    status: formData.get("status"),
    notes: formData.get("notes"),
  });
}
