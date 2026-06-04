"use client";

import FieldError from "@/ui/forms/FieldError";
import { formInputClassName } from "@/ui/forms/formClasses";

import SelectPicker from "./SelectPicker";
import { isoToDateTimeLocal, projectPickerOptions } from "./timesheetFormUtils";

import type {
  EmployeeOption,
  ProjectOption,
  TimesheetFormErrors,
} from "@/lib/services/timesheet/timesheet.types";

export type TimesheetFormValues = {
  employeeId: string;
  projectId: string;
  startedAt: string;
  endedAt: string;
  activity: string;
  notes: string;
};

type TimesheetFormFieldsProps = {
  employees: EmployeeOption[];
  projects: ProjectOption[];
  employeeId: string;
  onEmployeeIdChange: (id: string) => void;
  projectId: string;
  onProjectIdChange: (id: string) => void;
  idPrefix?: string;
  errors?: TimesheetFormErrors;
  values?: TimesheetFormValues;
  defaultStartedAt?: string;
};

function fieldId(prefix: string | undefined, name: string) {
  return prefix ? `${name}-${prefix}` : name;
}

export function timesheetFormValuesFromRow(row: {
  employeeId: string;
  projectId: string;
  startedAtIso: string;
  endedAtIso: string | null;
  activity: string | null;
  notes: string | null;
}): TimesheetFormValues {
  return {
    employeeId: row.employeeId,
    projectId: row.projectId,
    startedAt: isoToDateTimeLocal(row.startedAtIso),
    endedAt: row.endedAtIso ? isoToDateTimeLocal(row.endedAtIso) : "",
    activity: row.activity ?? "",
    notes: row.notes ?? "",
  };
}

export default function TimesheetFormFields({
  employees,
  projects,
  employeeId,
  onEmployeeIdChange,
  projectId,
  onProjectIdChange,
  idPrefix,
  errors,
  values,
  defaultStartedAt,
}: TimesheetFormFieldsProps) {
  const isEdit = values !== undefined;
  const employeePickerId = idPrefix ? `employeePicker-${idPrefix}` : "employeeId";
  const projectPickerId = idPrefix ? `projectPicker-${idPrefix}` : "projectPicker";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={employeePickerId} className="mb-1 block text-sm text-white/70">
            Employee
          </label>
          <SelectPicker
            id={employeePickerId}
            options={employees.map((e) => ({ id: e.id, label: e.label }))}
            value={employeeId}
            onChange={onEmployeeIdChange}
            placeholder="Select employee"
          />
          <FieldError messages={errors?.employeeId} />
        </div>

        <div>
          <label htmlFor={projectPickerId} className="mb-1 block text-sm text-white/70">
            Project
          </label>
          <SelectPicker
            id={projectPickerId}
            options={projectPickerOptions(projects)}
            value={projectId}
            onChange={onProjectIdChange}
            placeholder="Select project"
          />
          <FieldError messages={errors?.projectId} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={fieldId(idPrefix, "startedAt")}
            className="mb-1 block text-sm text-white/70"
          >
            Started at
          </label>
          <input
            id={fieldId(idPrefix, "startedAt")}
            name="startedAt"
            type="datetime-local"
            className={`${formInputClassName} datetime-picker`}
            defaultValue={values?.startedAt ?? defaultStartedAt}
            required
          />
          <FieldError messages={errors?.startedAt} />
        </div>

        <div>
          <label
            htmlFor={fieldId(idPrefix, "endedAt")}
            className="mb-1 block text-sm text-white/70"
          >
            Ended at (optional)
          </label>
          <input
            id={fieldId(idPrefix, "endedAt")}
            name="endedAt"
            type="datetime-local"
            className={`${formInputClassName} datetime-picker`}
            defaultValue={values?.endedAt}
          />
          <FieldError messages={errors?.endedAt} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={fieldId(idPrefix, "activity")}
            className="mb-1 block text-sm text-white/70"
          >
            Activity (optional)
          </label>
          <input
            id={fieldId(idPrefix, "activity")}
            name="activity"
            className={formInputClassName}
            placeholder={isEdit ? undefined : "Welding"}
            defaultValue={values?.activity}
          />
          <FieldError messages={errors?.activity} />
        </div>
        <div>
          <label htmlFor={fieldId(idPrefix, "notes")} className="mb-1 block text-sm text-white/70">
            Notes (optional)
          </label>
          <input
            id={fieldId(idPrefix, "notes")}
            name="notes"
            className={formInputClassName}
            placeholder={isEdit ? undefined : "Column welding"}
            defaultValue={values?.notes}
          />
          <FieldError messages={errors?.notes} />
        </div>
      </div>
    </div>
  );
}
