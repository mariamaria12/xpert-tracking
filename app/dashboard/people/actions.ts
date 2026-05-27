"use server";

import { auth } from "auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const CreateEmployeeSchema = z.object({
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

export type CreateEmployeeFormState =
  | {
      success?: boolean;
      message?: string;
      errors?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        phone?: string[];
        role?: string[];
      };
    }
  | undefined;

export async function createEmployee(
  _prevState: CreateEmployeeFormState,
  formData: FormData,
): Promise<CreateEmployeeFormState> {
  const parsed = CreateEmployeeSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    role: formData.get("role"),
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
    return { message: "You must be signed in to add people." };
  }

  const { firstName, lastName, email, phone, role } = parsed.data;

  const { error } = await supabase.from("employees").insert({
    first_name: firstName,
    last_name: lastName,
    email: email || null,
    phone: phone || null,
    role: role || null,
    created_by: createdBy,
  });

  if (error) {
    console.error("Failed to create employee:", error);
    return { message: error.message };
  }

  revalidatePath("/dashboard/people");
  return { success: true };
}

const UpdateEmployeeSchema = CreateEmployeeSchema.extend({
  id: z.string().trim().min(1, "Employee id is required."),
});

export type UpdateEmployeeFormState = CreateEmployeeFormState;

export async function updateEmployee(
  _prevState: UpdateEmployeeFormState,
  formData: FormData,
): Promise<UpdateEmployeeFormState> {
  const parsed = UpdateEmployeeSchema.safeParse({
    id: formData.get("id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { id, firstName, lastName, email, phone, role } = parsed.data;

  const { error } = await supabase
    .from("employees")
    .update({
      first_name: firstName,
      last_name: lastName,
      email: email || null,
      phone: phone || null,
      role: role || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update employee:", error);
    return { message: error.message };
  }

  revalidatePath("/dashboard/people");
  return { success: true };
}
