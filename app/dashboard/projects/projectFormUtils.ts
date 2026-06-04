import {
  formatProjectStatusLabel,
  PROJECT_STATUSES,
  projectStatusOptions,
  type ProjectStatus,
} from "@/lib/services/projects/projectStatuses";

export function projectStatusOptionsForRow(status: string) {
  const current = status.trim().toLowerCase();
  if (current && !PROJECT_STATUSES.includes(current as ProjectStatus)) {
    return [{ id: current, label: formatProjectStatusLabel(current) }, ...projectStatusOptions];
  }
  return projectStatusOptions;
}

export function initialProjectStatus(status: string) {
  const options = projectStatusOptionsForRow(status);
  const current = status.trim().toLowerCase();
  if (current && options.some((o) => o.id === current)) {
    return current;
  }
  return options[0]?.id ?? "draft";
}
