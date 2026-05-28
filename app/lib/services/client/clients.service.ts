import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";

import type { ClientCreateInput, ClientRow, ClientRowsResult, ClientUpdateInput } from "./clients.types";

type ClientDbRow = {
  id: string;
  company_name: string;
  industry: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  delivery_address: string | null;
  billing_address: string | null;
  status: string | null;
  notes: string | null;
};

type ProjectDbRow = {
  id: string;
  client_id: string;
};

function toNullIfEmpty(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length ? trimmed : null;
}

export async function getClientRows(): Promise<ClientRowsResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ data: clients, error: clientsError }, { data: projects, error: projectsError }] =
    await Promise.all([
      supabase
        .from("clients")
        .select(
          "id, company_name, industry, contact_person, email, phone, delivery_address, billing_address, status, notes",
        )
        .order("company_name", { ascending: true }),
      supabase.from("projects").select("id, client_id"),
    ]);

  if (clientsError) {
    console.error("Failed to load clients:", clientsError);
    return { rows: [], error: clientsError.message };
  }

  if (projectsError) {
    console.error("Failed to load projects:", projectsError);
    // Still show clients even if project counts fail.
  }

  const projectCountByClientId = new Map<string, number>();
  for (const project of (projects ?? []) as ProjectDbRow[]) {
    projectCountByClientId.set(
      project.client_id,
      (projectCountByClientId.get(project.client_id) ?? 0) + 1,
    );
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
    projectCount: projectCountByClientId.get(c.id) ?? 0,
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
    status: toNullIfEmpty(input.status),
    notes: toNullIfEmpty(input.notes),
    created_by: resolvedUserId,
  });

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
      status: toNullIfEmpty(input.status),
      notes: toNullIfEmpty(input.notes),
    })
    .eq("id", input.id);

  if (error) {
    console.error("Failed to update client:", error);
    return { error: error.message };
  }

  return {};
}
