"use client";

import { FolderKanban } from "lucide-react";

import DataTable from "@/ui/table/DataTable";

import { projectColumns, type ProjectRow } from "./columns";

type ProjectsTableProps = {
  rows: ProjectRow[];
  error?: string;
};

export default function ProjectsTable({ rows, error }: ProjectsTableProps) {
  const emptyState = error
    ? {
        title: "Could not load projects",
        description: error,
        icon: <FolderKanban className="h-6 w-6" aria-hidden />,
      }
    : {
        title: "No projects yet",
        description: "Your projects will appear here once created.",
        icon: <FolderKanban className="h-6 w-6" aria-hidden />,
      };

  return (
    <DataTable<ProjectRow>
      columns={projectColumns}
      data={rows}
      emptyState={emptyState}
      getRowId={(row) => row.id}
    />
  );
}

