"use client";

import { Filter, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  formatProjectStatusLabel,
  projectStatusOptions,
} from "@/lib/services/projects/projectStatuses";
import { cn } from "@/lib/utils";

import {
  getProjectsPageFilterPreset,
  listSelectableProjectsPagePresets,
  type ProjectsPageFilterState,
} from "./projectsPageFilter";
import ProjectStatusBadge from "./ProjectStatusBadge";

type ProjectStatusFilterProps = {
  filter: ProjectsPageFilterState;
  onFilterChange: (filter: ProjectsPageFilterState) => void;
};

export default function ProjectStatusFilter({ filter, onFilterChange }: ProjectStatusFilterProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { presets: selectedPresets, statuses: selectedStatuses } = filter;

  const availablePresets = useMemo(
    () => listSelectableProjectsPagePresets(selectedPresets),
    [selectedPresets]
  );

  const availableStatusOptions = useMemo(
    () => projectStatusOptions.filter((option) => !selectedStatuses.includes(option.id)),
    [selectedStatuses]
  );

  const hasPresets = selectedPresets.length > 0;
  const showPresetOptions = availablePresets.length > 0;
  const showStatusOptions = availableStatusOptions.length > 0;
  const showAddFilter = showPresetOptions || showStatusOptions;

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function addPreset(presetId: string) {
    onFilterChange({
      presets: selectedPresets.includes(presetId)
        ? selectedPresets
        : [...selectedPresets, presetId],
      statuses: [],
    });
    setOpen(false);
  }

  function removePreset(presetId: string) {
    onFilterChange({
      presets: selectedPresets.filter((id) => id !== presetId),
      statuses: selectedStatuses,
    });
  }

  function addStatus(statusId: string) {
    onFilterChange({
      presets: [],
      statuses: selectedStatuses.includes(statusId)
        ? selectedStatuses
        : [...selectedStatuses, statusId],
    });
    setOpen(false);
  }

  function removeStatus(statusId: string) {
    onFilterChange({
      presets: selectedPresets,
      statuses: selectedStatuses.filter((id) => id !== statusId),
    });
  }

  return (
    <div ref={containerRef} className="flex flex-wrap items-center gap-2">
      {showAddFilter ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:bg-white/10",
              open && "ring-2 ring-cyan-400"
            )}
            aria-expanded={open}
            aria-haspopup="listbox"
          >
            <Filter className="h-4 w-4 text-white/50" aria-hidden />
            {hasPresets ? "Add status" : "Add filter"}
          </button>

          {open ? (
            <div
              role="listbox"
              aria-label="Project filters"
              className="absolute left-0 z-20 mt-2 max-h-72 w-56 overflow-auto rounded-xl border border-white/20 bg-[#070B14] p-2 shadow-xl shadow-black/40 sm:w-64"
            >
              {showPresetOptions ? (
                <div className={cn(showStatusOptions && "mb-2 border-b border-white/10 pb-2")}>
                  {availablePresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => addPreset(preset.id)}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-emerald-300 transition hover:bg-white/5"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              ) : null}
              {showStatusOptions
                ? availableStatusOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => addStatus(option.id)}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                    >
                      {option.label}
                    </button>
                  ))
                : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {selectedPresets.map((presetId) => {
        const preset = getProjectsPageFilterPreset(presetId);
        if (!preset) {
          return null;
        }

        return (
          <div
            key={preset.id}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 py-1 pl-2 pr-1"
          >
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                preset.chipClassName
              )}
            >
              {preset.label}
            </span>
            <button
              type="button"
              onClick={() => removePreset(preset.id)}
              className="rounded-md p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label={`Remove ${preset.label} filter`}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        );
      })}

      {selectedStatuses.map((statusId) => {
        const label = formatProjectStatusLabel(statusId);
        return (
          <div
            key={statusId}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 py-1 pl-2 pr-1"
          >
            <ProjectStatusBadge status={statusId} />
            <button
              type="button"
              onClick={() => removeStatus(statusId)}
              className="rounded-md p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label={`Remove ${label} filter`}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
