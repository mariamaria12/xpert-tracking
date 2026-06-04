import { isActiveProjectStatus } from "@/lib/services/projects/projectStatuses";

import { PROJECTS_FILTER_ACTIVE } from "./projects.constants";

import type { ProjectRowsFilter } from "./filterProjectRows";

export type ProjectsPageFilterPreset = {
  id: string;
  label: string;
  chipClassName: string;
  matchesStatus: (status: string) => boolean;
};

/** Named filter presets for the projects page (`?filter=<id>` on navigation). */
export const PROJECTS_PAGE_FILTER_PRESETS: Record<string, ProjectsPageFilterPreset> = {
  [PROJECTS_FILTER_ACTIVE]: {
    id: PROJECTS_FILTER_ACTIVE,
    label: "Active",
    chipClassName: "bg-emerald-400/10 text-emerald-400",
    matchesStatus: isActiveProjectStatus,
  },
};

export type ProjectsPageFilterState = {
  presets: string[];
  statuses: string[];
};

export function resolveInitialProjectsPageFilter(
  preset: string | undefined
): ProjectsPageFilterState {
  if (!preset || !(preset in PROJECTS_PAGE_FILTER_PRESETS)) {
    return { presets: [], statuses: [] };
  }

  return { presets: [preset], statuses: [] };
}

export function getProjectsPageFilterPreset(
  presetId: string
): ProjectsPageFilterPreset | undefined {
  return PROJECTS_PAGE_FILTER_PRESETS[presetId];
}

export function listSelectableProjectsPagePresets(
  selectedPresetIds: string[]
): ProjectsPageFilterPreset[] {
  return Object.values(PROJECTS_PAGE_FILTER_PRESETS).filter(
    (preset) => !selectedPresetIds.includes(preset.id)
  );
}

export function toProjectRowsFilter(
  nameQuery: string,
  statusFilter: ProjectsPageFilterState
): ProjectRowsFilter {
  return {
    nameQuery,
    presets: statusFilter.presets,
    statuses: statusFilter.statuses,
  };
}

export function hasProjectsPageStatusFilters(statusFilter: ProjectsPageFilterState): boolean {
  return statusFilter.presets.length > 0 || statusFilter.statuses.length > 0;
}
