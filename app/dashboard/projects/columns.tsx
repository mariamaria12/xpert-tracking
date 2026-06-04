import React from "react";

import { cn, formatDate } from "@/lib/utils";

import EditProjectDialog from "./EditProjectDialog";
import ProjectStatusBadge from "./ProjectStatusBadge";

import type { ClientOption, ProjectRow } from "@/lib/services/projects/projects.types";
import type { DataTableColumn } from "@/ui/table/DataTable";

function formatHours(value: number | null) {
  if (value === null) {
    return "—";
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
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
  if (!dueDate) {
    return "muted";
  }

  const dueDay = new Date(dueDate);
  dueDay.setHours(23, 59, 59, 999);
  if (referenceDate.getTime() > dueDay.getTime()) {
    return "red";
  }

  if (estimatedHours === null) {
    return "green";
  }

  // "Remaining time" vs "time until due date" heuristic:
  // assume 8h/day capacity until due date.
  const remainingHours = Math.max(0, estimatedHours - actualHours);
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysRemaining = Math.max(
    0,
    Math.ceil((dueDay.getTime() - referenceDate.getTime()) / msPerDay)
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
  if (!dueDate) {
    return <span className="text-white/30">—</span>;
  }

  const tone = getDueDateTone({
    dueDate,
    estimatedHours,
    actualHours,
    referenceDate: new Date(),
  });

  const bulletClassName =
    tone === "red" ? "bg-red-400" : tone === "orange" ? "bg-amber-400" : "bg-emerald-400";

  return (
    <span className="inline-flex items-center gap-2 text-white/80">
      <span className={cn("h-2 w-2 rounded-full", bulletClassName)} aria-hidden />
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
      getSortValue: (row) => row.name,
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
      getSortValue: (row) => row.estimatedHours,
      cell: (row) => <span className="text-white/80">{formatHours(row.estimatedHours)}</span>,
    },
    {
      id: "actualHours",
      header: "Actual hours",
      align: "right",
      getSortValue: (row) => row.actualHours,
      cell: (row) => <span className="text-white/80">{formatHours(row.actualHours)}</span>,
    },
    {
      id: "workers",
      header: "Workers",
      align: "right",
      getSortValue: (row) => row.workers,
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
      getSortValue: (row) => row.dueDate?.getTime() ?? null,
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
