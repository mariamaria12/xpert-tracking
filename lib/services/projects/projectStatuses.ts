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

/** Statuses excluded from the “active” in-progress project group. */
export const ACTIVE_PROJECT_EXCLUDED_STATUSES = [
  "draft",
  "quoted",
  "approved",
  "completed",
  "cancelled",
] as const;

const activeProjectExcludedSet = new Set<string>(
  ACTIVE_PROJECT_EXCLUDED_STATUSES.map((status) => status.toLowerCase())
);

export function formatProjectStatusLabel(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isActiveProjectStatus(status: string) {
  return !activeProjectExcludedSet.has(status.trim().toLowerCase());
}

export function getActiveProjectStatuses(): ProjectStatus[] {
  return PROJECT_STATUSES.filter((status) => isActiveProjectStatus(status));
}

export const projectStatusOptions = PROJECT_STATUSES.map((status) => ({
  id: status,
  label: formatProjectStatusLabel(status),
}));
