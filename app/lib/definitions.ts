import type { LucideIcon } from "lucide-react";
import * as z from 'zod'

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export interface Project {
  id: string;
  name: string;
  status: "active" | "completed" | "on-hold";
  members: number;
  dueDate: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  email: string;
  status: "active" | "inactive";
}

export interface TimesheetEntry {
  id: string;
  employee: string;
  project: string;
  date: string;
  hours: number;
  status: "approved" | "pending" | "rejected";
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  status: "available" | "in-use" | "maintenance";
}
 
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.email({ error: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    })
    .trim(),
})
 
export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined