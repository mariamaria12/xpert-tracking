"use server";

import { revalidatePath } from "next/cache";

import { requireUserId } from "@/lib/auth/supabaseAuth";
import {
  readClientCreateInput,
  readClientUpdateInput,
  getClientFieldErrors,
} from "@/lib/services/client/clients.schema";
import { createClientCompany, updateClientCompany } from "@/lib/services/client/clients.service";

import type { ClientFormState } from "@/lib/services/client/clients.types";

export async function createCompany(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const parsed = readClientCreateInput(formData);

  if (!parsed.success) {
    return { errors: getClientFieldErrors(parsed.error) };
  }

  const createdBy = await requireUserId();
  const { error } = await createClientCompany({
    input: parsed.data,
    createdBy,
  });

  if (error) {
    return { message: error };
  }

  revalidatePath("/dashboard/clients");
  return { success: true };
}

export async function updateCompany(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const parsed = readClientUpdateInput(formData);

  if (!parsed.success) {
    return { errors: getClientFieldErrors(parsed.error) };
  }

  const { error } = await updateClientCompany({ input: parsed.data });

  if (error) {
    return { message: error };
  }

  revalidatePath("/dashboard/clients");
  return { success: true };
}
