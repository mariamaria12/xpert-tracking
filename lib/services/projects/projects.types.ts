import type { ClientOption } from "@/dashboard/projects/AddProjectDialog";

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

export type ProjectRowsResult =
  | { rows: ProjectRow[]; error?: undefined }
  | { rows: ProjectRow[]; error: string };

export type ProjectCreateInput = {
  name: string;
  clientId: string;
  status: string;
  estimatedHours?: string;
  dueDate?: string;
  description?: string;
};

export type ProjectUpdateInput = ProjectCreateInput & { id: string };

export type ProjectFormErrors = Partial<
  Record<
    "name" | "clientId" | "status" | "estimatedHours" | "dueDate" | "description" | "id",
    string[]
  >
>;

export type ProjectFormState =
  | {
      success?: boolean;
      message?: string;
      errors?: ProjectFormErrors;
    }
  | undefined;

export type ProjectColumnsArgs = {
  clients: ClientOption[];
};
