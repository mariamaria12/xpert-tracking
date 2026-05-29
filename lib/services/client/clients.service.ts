import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

import type { ClientCreateInput, ClientRow, ClientRowsResult, ClientUpdateInput } from "./clients.types";

type ClientDbRow = Pick<
  Database["public"]["Tables"]["clients"]["Row"],
  | "id"
  | "company_name"
  | "industry"
  | "contact_person"
  | "email"
  | "phone"
  | "delivery_address"
  | "billing_address"
  | "status"
  | "notes"
> & {
  projects?: Pick<Database["public"]["Tables"]["projects"]["Row"], "id">[] | null;
};

function toNullIfEmpty(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length ? trimmed : null;
}

function toUndefinedIfEmpty(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length ? trimmed : undefined;
}

export async function getClientRows(): Promise<ClientRowsResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: clients, error } = await supabase
    .from("clients")
    .select(
      `
      id,
      company_name,
      industry,
      contact_person,
      email,
      phone,
      delivery_address,
      billing_address,
      status,
      notes,
      projects(id)
    `,
    )
    .order("company_name", { ascending: true });

  if (error) {
    console.error("Failed to load clients:", error);
    return { rows: [], error: error.message };
  }

  const rows: ClientRow[] = ((clients ?? []) as ClientDbRow[]).map((c) => ({
    id: c.id,
    companyName: c.company_name,
    industry: c.industry,
    contactPerson: c.contact_person,
    email: c.email,
    phone: c.phone,
    deliveryAddress: c.delivery_address,
    billingAddress: c.billing_address,
    status: c.status,
    notes: c.notes,
    projectCount: c.projects?.length ?? 0,
  }));

  return { rows };
}

export async function createClientCompany({
  input,
  createdBy,
}: {
  input: ClientCreateInput;
  createdBy?: string | null;
}): Promise<{ error?: string }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let resolvedUserId = createdBy ?? null;
  if (!resolvedUserId) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Failed to resolve user:", error);
    }
    resolvedUserId = user?.id ?? null;
  }

  if (!resolvedUserId) {
    return { error: "You must be signed in to add clients." };
  }

  const { error } = await supabase.from("clients").insert({
    company_name: input.companyName,
    industry: toNullIfEmpty(input.industry),
    contact_person: toNullIfEmpty(input.contactPerson),
    email: toNullIfEmpty(input.email),
    phone: toNullIfEmpty(input.phone),
    billing_address: toNullIfEmpty(input.billingAddress),
    delivery_address: toNullIfEmpty(input.deliveryAddress),
    status: toUndefinedIfEmpty(input.status),
    notes: toNullIfEmpty(input.notes),
    created_by: resolvedUserId,
  } satisfies Database["public"]["Tables"]["clients"]["Insert"]);

  if (error) {
    console.error("Failed to create client:", error);
    return { error: error.message };
  }

  return {};
}

export async function updateClientCompany({
  input,
}: {
  input: ClientUpdateInput;
}): Promise<{ error?: string }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("clients")
    .update({
      company_name: input.companyName,
      industry: toNullIfEmpty(input.industry),
      contact_person: toNullIfEmpty(input.contactPerson),
      email: toNullIfEmpty(input.email),
      phone: toNullIfEmpty(input.phone),
      billing_address: toNullIfEmpty(input.billingAddress),
      delivery_address: toNullIfEmpty(input.deliveryAddress),
      status: toUndefinedIfEmpty(input.status),
      notes: toNullIfEmpty(input.notes),
    } satisfies Database["public"]["Tables"]["clients"]["Update"])
    .eq("id", input.id);

  if (error) {
    console.error("Failed to update client:", error);
    return { error: error.message };
  }

  return {};
}
