import React from "react";

import { cn } from "@/lib/utils";
import type { DataTableColumn } from "@/ui/table/DataTable";

import type { TimesheetStatusDisplay } from "./timesheetStatus";
import EditTimesheetDialog from "./EditTimesheetDialog";
import type { EmployeeOption, ProjectOption, TimesheetRow } from "@/lib/services/timesheet/timesheet.types";

function StatusBadge({ display }: { display: TimesheetStatusDisplay }) {
  const styles =
    display.status === "InProgress"
      ? "bg-cyan-400/10 text-cyan-400"
      : display.status === "Break"
        ? "bg-amber-400/10 text-amber-300"
        : "bg-emerald-400/10 text-emerald-400";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        styles,
      )}
    >
      {display.label}
    </span>
  );
}

export function getTimesheetColumns({
  employees,
  projects,
}: {
  employees: EmployeeOption[];
  projects: ProjectOption[];
}): DataTableColumn<TimesheetRow>[] {
  return [
    {
      id: "employee",
      header: "Employee",
      cell: (row) => (
        <span className="font-medium text-white/80">{row.employeeName}</span>
      ),
    },
    {
      id: "project",
      header: "Project",
      cell: (row) => <span className="text-white/80">{row.projectName}</span>,
    },
    {
      id: "date",
      header: "Date",
      cell: (row) => <span className="text-white/80">{row.dateLabel}</span>,
    },
    {
      id: "hours",
      header: "Hours",
      align: "right",
      cell: (row) => <span className="text-white/80">{row.hoursLabel}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge display={row.status} />,
    },
    {
      id: "activity",
      header: "Activity",
      visibleByDefault: false,
      cell: (row) => (
        <span className="text-white/80">{row.activity ?? "—"}</span>
      ),
    },
    {
      id: "startedAt",
      header: "Start time",
      visibleByDefault: false,
      cell: (row) => <span className="text-white/80">{row.startedAtLabel}</span>,
    },
    {
      id: "endedAt",
      header: "End time",
      visibleByDefault: false,
      cell: (row) => <span className="text-white/80">{row.endedAtLabel}</span>,
    },
    {
      id: "notes",
      header: "Notes",
      visibleByDefault: false,
      cell: (row) => (
        <span className="text-white/80">{row.notes?.trim() ? row.notes : "—"}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (row) => (
        <EditTimesheetDialog row={row} employees={employees} projects={projects} />
      ),
    },
  ];
}
