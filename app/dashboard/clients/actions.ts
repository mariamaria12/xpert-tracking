"use server";

import { auth } from "auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const ClientSchema = z.object({
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

export type ClientFormState =
  | {
      success?: boolean;
      message?: string;
      errors?: {
        companyName?: string[];
        industry?: string[];
        contactPerson?: string[];
        email?: string[];
        phone?: string[];
        billingAddress?: string[];
        deliveryAddress?: string[];
        status?: string[];
        notes?: string[];
        id?: string[];
      };
    }
  | undefined;

export async function createCompany(
  _prevState: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const parsed = ClientSchema.safeParse({
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
    return { message: "You must be signed in to add clients." };
  }

  const {
    companyName,
    industry,
    contactPerson,
    email,
    phone,
    billingAddress,
    deliveryAddress,
    status,
    notes,
  } = parsed.data;

  const { error } = await supabase.from("clients").insert({
    company_name: companyName,
    industry: industry || null,
    contact_person: contactPerson || null,
    email: email || null,
    phone: phone || null,
    billing_address: billingAddress || null,
    delivery_address: deliveryAddress || null,
    status: status || null,
    notes: notes || null,
    created_by: createdBy,
  });

  if (error) {
    console.error("Failed to create client:", error);
    return { message: error.message };
  }

  revalidatePath("/dashboard/clients");
  return { success: true };
}

const UpdateClientSchema = ClientSchema.extend({
  id: z.string().trim().min(1, "Client id is required."),
});

export async function updateCompany(
  _prevState: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const parsed = UpdateClientSchema.safeParse({
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

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    id,
    companyName,
    industry,
    contactPerson,
    email,
    phone,
    billingAddress,
    deliveryAddress,
    status,
    notes,
  } = parsed.data;

  const { error } = await supabase
    .from("clients")
    .update({
      company_name: companyName,
      industry: industry || null,
      contact_person: contactPerson || null,
      email: email || null,
      phone: phone || null,
      billing_address: billingAddress || null,
      delivery_address: deliveryAddress || null,
      status: status || null,
      notes: notes || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update client:", error);
    return { message: error.message };
  }

  revalidatePath("/dashboard/clients");
  return { success: true };
}

