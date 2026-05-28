import type { TimesheetStatusDisplay } from "@/dashboard/timesheet/timesheetStatus";

export type TimesheetRow = {
  id: string;
  employeeId: string;
  projectId: string;
  employeeName: string;
  projectName: string;
  dateLabel: string;
  hoursLabel: string;
  status: TimesheetStatusDisplay;
  activity: string | null;
  notes: string | null;
  startedAtLabel: string;
  endedAtLabel: string;
  startedAtIso: string;
  endedAtIso: string | null;
};

export type TimesheetRowsResult =
  | { rows: TimesheetRow[]; error?: undefined }
  | { rows: TimesheetRow[]; error: string };

export type TimesheetFormErrors = Partial<
  Record<
    "employeeId" | "projectId" | "startedAt" | "endedAt" | "activity" | "notes" | "id",
    string[]
  >
>;

export type TimesheetFormState =
  | {
      success?: boolean;
      message?: string;
      errors?: TimesheetFormErrors;
    }
  | undefined;

export type TimesheetCreateInput = {
  employeeId: string;
  projectId: string;
  startedAt: string;
  endedAt?: string;
  activity?: string;
  notes?: string;
};

export type TimesheetUpdateInput = TimesheetCreateInput & { id: string };

export type EmployeeOption = { id: string; label: string };
export type ProjectOption = { id: string; label: string; status: string | null };
