import type { SelectPickerOption } from "./SelectPicker";
import type { ProjectOption } from "@/lib/services/timesheet/timesheet.types";


function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function nowDateTimeLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function isoToDateTimeLocal(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return "";
  }
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function projectPickerOptions(projects: ProjectOption[]): SelectPickerOption[] {
  return projects.map((p) => {
    const isCompleted = (p.status ?? "").toLowerCase() === "completed";
    return {
      id: p.id,
      label: p.label,
      rightLabel: isCompleted ? "Completed" : undefined,
      rightLabelClassName: isCompleted ? "text-emerald-400" : undefined,
      isDimmed: isCompleted,
    };
  });
}
