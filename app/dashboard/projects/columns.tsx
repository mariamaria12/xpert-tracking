import React from "react";

import { cn, formatDate } from "@/lib/utils";
import type { DataTableColumn } from "@/ui/table/DataTable";

import type { ClientOption } from "./AddProjectDialog";
import EditProjectDialog from "./EditProjectDialog";

export type ProjectRow = {
  id: string;
  name: string;
  clientId: string;
  companyName: string;
  estimatedHours: number | null;
  actualHours: number;
  workers: number;
  status: string;
  dueDate: Date | null;
  dueDateIso: string | null;
  description: string | null;
};

function formatHours(value: number | null) {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}

function ProjectStatusBadge({ status }: { status: string }) {
  const normalized = status.trim().toLowerCase();

  const styles =
    normalized === "completed"
      ? "bg-emerald-400/10 text-emerald-400"
      : normalized === "active"
        ? "bg-cyan-400/10 text-cyan-400"
        : "bg-amber-400/10 text-amber-300";

  const label = status.trim() || "—";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        styles,
      )}
    >
      {label}
    </span>
  );
}

function getDueDateTone({
  dueDate,
  estimatedHours,
  actualHours,
  referenceDate,
}: {
  dueDate: Date | null;
  estimatedHours: number | null;
  actualHours: number;
  referenceDate: Date;
}) {
  if (!dueDate) return "muted";

  const dueDay = new Date(dueDate);
  dueDay.setHours(23, 59, 59, 999);
  if (referenceDate.getTime() > dueDay.getTime()) return "red";

  if (estimatedHours === null) return "green";

  // "Remaining time" vs "time until due date" heuristic:
  // assume 8h/day capacity until due date.
  const remainingHours = Math.max(0, estimatedHours - actualHours);
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysRemaining = Math.max(
    0,
    Math.ceil((dueDay.getTime() - referenceDate.getTime()) / msPerDay),
  );
  const capacityHours = daysRemaining * 8;

  return remainingHours <= capacityHours ? "green" : "orange";
}

function DueDateCell({
  dueDate,
  estimatedHours,
  actualHours,
}: {
  dueDate: Date | null;
  estimatedHours: number | null;
  actualHours: number;
}) {
  if (!dueDate) return <span className="text-white/30">—</span>;

  const tone = getDueDateTone({
    dueDate,
    estimatedHours,
    actualHours,
    referenceDate: new Date(),
  });

  const bulletClassName =
    tone === "red"
      ? "bg-red-400"
      : tone === "orange"
        ? "bg-amber-400"
        : "bg-emerald-400";

  return (
    <span className="inline-flex items-center gap-2 text-white/80">
      <span
        className={cn("h-2 w-2 rounded-full", bulletClassName)}
        aria-hidden
      />
      <span>{formatDate(dueDate)}</span>
    </span>
  );
}

export function getProjectColumns({
  clients,
}: {
  clients: ClientOption[];
}): DataTableColumn<ProjectRow>[] {
  return [
  {
    id: "name",
    header: "Name",
    cell: (row) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-white/80">{row.name}</div>
        <div className="mt-0.5 truncate text-xs text-white/40">{row.companyName}</div>
      </div>
    ),
  },
  {
    id: "estimatedHours",
    header: "Estimated hours",
    align: "right",
    cell: (row) => <span className="text-white/80">{formatHours(row.estimatedHours)}</span>,
  },
  {
    id: "actualHours",
    header: "Actual hours",
    align: "right",
    cell: (row) => <span className="text-white/80">{formatHours(row.actualHours)}</span>,
  },
  {
    id: "workers",
    header: "Workers",
    align: "right",
    cell: (row) => <span className="text-white/80">{row.workers}</span>,
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => <ProjectStatusBadge status={row.status} />,
  },
  {
    id: "dueDate",
    header: "Due date",
    cell: (row) => (
      <DueDateCell
        dueDate={row.dueDate}
        estimatedHours={row.estimatedHours}
        actualHours={row.actualHours}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    align: "right",
    cell: (row) => <EditProjectDialog row={row} clients={clients} />,
  },
  ];
}

