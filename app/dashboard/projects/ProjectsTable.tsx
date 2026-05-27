"use client";

import { FolderKanban } from "lucide-react";

import DataTable from "@/ui/table/DataTable";

import { getProjectColumns, type ProjectRow } from "./columns";
import type { ClientOption } from "./AddProjectDialog";

type ProjectsTableProps = {
  rows: ProjectRow[];
  error?: string;
  clients: ClientOption[];
};

export default function ProjectsTable({ rows, error, clients }: ProjectsTableProps) {
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

  const columns = getProjectColumns({ clients });

  return (
    <DataTable<ProjectRow>
      columns={columns}
      data={rows}
      emptyState={emptyState}
      getRowId={(row) => row.id}
    />
  );
}

