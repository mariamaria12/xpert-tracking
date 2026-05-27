"use client";

import { Clock } from "lucide-react";

import DataTable from "@/ui/table/DataTable";

import { getTimesheetColumns, type TimesheetRow } from "./columns";
import type { EmployeeOption, ProjectOption } from "./AddTimesheetDialog";

type TimesheetTableProps = {
  rows: TimesheetRow[];
  error?: string;
  employees: EmployeeOption[];
  projects: ProjectOption[];
};

export default function TimesheetTable({
  rows,
  error,
  employees,
  projects,
}: TimesheetTableProps) {
  const emptyState = error
    ? {
        title: "Could not load timesheets",
        description: error,
        icon: <Clock className="h-6 w-6" aria-hidden />,
      }
    : {
        title: "No time logs yet",
        description: "Logged hours will appear here once recorded.",
        icon: <Clock className="h-6 w-6" aria-hidden />,
      };

  const columns = getTimesheetColumns({ employees, projects });

  return (
    <DataTable<TimesheetRow>
      columns={columns}
      data={rows}
      emptyState={emptyState}
      getRowId={(row) => row.id}
    />
  );
}
