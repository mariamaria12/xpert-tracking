import type { LucideIcon } from "lucide-react";

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
