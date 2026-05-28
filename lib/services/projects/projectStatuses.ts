export const PROJECT_STATUSES = [
  "draft",
  "quoted",
  "approved",
  "engineering",
  "procurement",
  "ready_for_production",
  "cutting",
  "fabrication",
  "assembly",
  "finishing",
  "quality_check",
  "ready_for_delivery",
  "delivered",
  "installed",
  "completed",
  "on_hold",
  "cancelled",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** Not shown on the home “active projects” section or count. */
export const HOME_INACTIVE_PROJECT_STATUSES = [
  "draft",
  "quoted",
  "approved",
  "completed",
  "cancelled",
] as const;

const homeInactiveSet = new Set<string>(
  HOME_INACTIVE_PROJECT_STATUSES.map((s) => s.toLowerCase()),
);

export function formatProjectStatusLabel(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isActiveHomeProject(status: string) {
  return !homeInactiveSet.has(status.trim().toLowerCase());
}

export const projectStatusOptions = PROJECT_STATUSES.map((status) => ({
  id: status,
  label: formatProjectStatusLabel(status),
}));

