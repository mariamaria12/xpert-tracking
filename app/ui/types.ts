import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
};
