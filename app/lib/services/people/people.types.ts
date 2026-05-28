import type { HoursWeekDisplay } from "@/dashboard/people/hoursWeekDisplay";
import type { LastLogDisplay } from "@/dashboard/people/lastLogDisplay";

export type PeopleRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  assignedProject: string | null;
  lastLog: LastLogDisplay | null;
  hoursWeek: HoursWeekDisplay | null;
};

export type PeopleRowsResult =
  | { rows: PeopleRow[]; error?: undefined }
  | { rows: PeopleRow[]; error: string };

export type EmployeeCreateInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
};

export type EmployeeUpdateInput = EmployeeCreateInput & {
  id: string;
};

export type EmployeeFormErrors = Partial<
  Record<"firstName" | "lastName" | "email" | "phone" | "role" | "id", string[]>
>;

export type EmployeeFormState =
  | {
      success?: boolean;
      message?: string;
      errors?: EmployeeFormErrors;
    }
  | undefined;
