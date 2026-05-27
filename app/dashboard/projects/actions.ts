"use server";

import { auth } from "auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

import { PROJECT_STATUSES } from "./projectStatuses";

const ProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required."),
  clientId: z.string().trim().min(1, "Client is required."),
  status: z.enum(PROJECT_STATUSES, { error: "Select a valid status." }),
  estimatedHours: z.string().trim().optional(),
  dueDate: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

export type ProjectFormState =
  | {
      success?: boolean;
      message?: string;
      errors?: {
        name?: string[];
        clientId?: string[];
        status?: string[];
        estimatedHours?: string[];
        dueDate?: string[];
        description?: string[];
        id?: string[];
      };
    }
  | undefined;

function parseEstimatedHours(value: string | undefined) {
  if (!value?.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function parseDueDate(value: string | undefined) {
  if (!value?.trim()) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value.trim()) ? value.trim() : null;
}

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const parsed = ProjectSchema.safeParse({
    name: formData.get("name"),
    clientId: formData.get("clientId"),
    status: formData.get("status"),
    estimatedHours: formData.get("estimatedHours"),
    dueDate: formData.get("dueDate"),
    description: formData.get("description"),
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
    return { message: "You must be signed in to add projects." };
  }

  const { name, clientId, status, estimatedHours, dueDate, description } = parsed.data;
  const estimated = parseEstimatedHours(estimatedHours);
  const due = parseDueDate(dueDate);

  if (estimatedHours?.trim() && estimated === null) {
    return { errors: { estimatedHours: ["Enter a valid number."] } };
  }
  if (dueDate?.trim() && due === null) {
    return { errors: { dueDate: ["Enter a valid date."] } };
  }

  const { error } = await supabase.from("projects").insert({
    name,
    client_id: clientId,
    status,
    estimated_hours: estimated,
    due_date: due,
    description: description || null,
    created_by: createdBy,
  });

  if (error) {
    console.error("Failed to create project:", error);
    return { message: error.message };
  }

  revalidatePath("/dashboard/projects");
  return { success: true };
}

const UpdateProjectSchema = ProjectSchema.extend({
  id: z.string().trim().min(1, "Project id is required."),
});

export async function updateProject(
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const parsed = UpdateProjectSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    clientId: formData.get("clientId"),
    status: formData.get("status"),
    estimatedHours: formData.get("estimatedHours"),
    dueDate: formData.get("dueDate"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { id, name, clientId, status, estimatedHours, dueDate, description } = parsed.data;
  const estimated = parseEstimatedHours(estimatedHours);
  const due = parseDueDate(dueDate);

  if (estimatedHours?.trim() && estimated === null) {
    return { errors: { estimatedHours: ["Enter a valid number."] } };
  }
  if (dueDate?.trim() && due === null) {
    return { errors: { dueDate: ["Enter a valid date."] } };
  }

  const { error } = await supabase
    .from("projects")
    .update({
      name,
      client_id: clientId,
      status,
      estimated_hours: estimated,
      due_date: due,
      description: description || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update project:", error);
    return { message: error.message };
  }

  revalidatePath("/dashboard/projects");
  return { success: true };
}
