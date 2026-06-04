"use client";

import FieldError from "@/ui/forms/FieldError";
import { formInputClassName } from "@/ui/forms/formClasses";

import SelectPicker from "../timesheet/SelectPicker";

import type { SelectPickerOption } from "../timesheet/SelectPicker";
import type { ClientOption , ProjectFormErrors } from "@/lib/services/projects/projects.types";

export type ProjectFormValues = {
  name: string;
  clientId: string;
  status: string;
  estimatedHours: string;
  dueDate: string;
  description: string;
};

type ProjectFormFieldsProps = {
  clients: ClientOption[];
  statusOptions: SelectPickerOption[];
  clientId: string;
  onClientIdChange: (id: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  idPrefix?: string;
  errors?: ProjectFormErrors;
  values?: ProjectFormValues;
};

function fieldId(prefix: string | undefined, name: string) {
  return prefix ? `${name}-${prefix}` : name;
}

export function projectFormValuesFromRow(row: {
  name: string;
  clientId: string;
  status: string;
  estimatedHours: number | null;
  dueDateIso: string | null;
  description: string | null;
}): ProjectFormValues {
  return {
    name: row.name ?? "",
    clientId: row.clientId,
    status: row.status ?? "",
    estimatedHours: row.estimatedHours === null ? "" : String(row.estimatedHours),
    dueDate: row.dueDateIso ?? "",
    description: row.description ?? "",
  };
}

export default function ProjectFormFields({
  clients,
  statusOptions,
  clientId,
  onClientIdChange,
  status,
  onStatusChange,
  idPrefix,
  errors,
  values,
}: ProjectFormFieldsProps) {
  const isEdit = values !== undefined;
  const clientPickerId = idPrefix ? `clientPicker-${idPrefix}` : "clientPicker";
  const statusPickerId = idPrefix ? `statusPicker-${idPrefix}` : "statusPicker";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId(idPrefix, "name")} className="mb-1 block text-sm text-white/70">
            Project name
          </label>
          <input
            id={fieldId(idPrefix, "name")}
            name="name"
            className={formInputClassName}
            placeholder={isEdit ? undefined : "Warehouse steel frame"}
            defaultValue={values?.name}
            required
          />
          <FieldError messages={errors?.name} />
        </div>
        <div>
          <label htmlFor={clientPickerId} className="mb-1 block text-sm text-white/70">
            Client
          </label>
          <SelectPicker
            id={clientPickerId}
            options={clients.map((c) => ({ id: c.id, label: c.label }))}
            value={clientId}
            onChange={onClientIdChange}
            placeholder="Select client"
          />
          <FieldError messages={errors?.clientId} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={statusPickerId} className="mb-1 block text-sm text-white/70">
            Status
          </label>
          <SelectPicker
            id={statusPickerId}
            options={statusOptions}
            value={status}
            onChange={onStatusChange}
            placeholder="Select status"
          />
          <FieldError messages={errors?.status} />
        </div>
        <div>
          <label
            htmlFor={fieldId(idPrefix, "estimatedHours")}
            className="mb-1 block text-sm text-white/70"
          >
            Estimated hours
          </label>
          <input
            id={fieldId(idPrefix, "estimatedHours")}
            name="estimatedHours"
            type="number"
            min="0"
            step="0.5"
            className={`${formInputClassName} number-input-no-spinner`}
            placeholder={isEdit ? undefined : "180"}
            defaultValue={values?.estimatedHours}
          />
          <FieldError messages={errors?.estimatedHours} />
        </div>
      </div>

      <div>
        <label htmlFor={fieldId(idPrefix, "dueDate")} className="mb-1 block text-sm text-white/70">
          Due date
        </label>
        <input
          id={fieldId(idPrefix, "dueDate")}
          name="dueDate"
          type="date"
          className={`${formInputClassName} date-picker`}
          defaultValue={values?.dueDate}
        />
        <FieldError messages={errors?.dueDate} />
      </div>

      <div>
        <label
          htmlFor={fieldId(idPrefix, "description")}
          className="mb-1 block text-sm text-white/70"
        >
          Description (optional)
        </label>
        <textarea
          id={fieldId(idPrefix, "description")}
          name="description"
          className={formInputClassName}
          rows={3}
          placeholder={isEdit ? undefined : "Project details..."}
          defaultValue={values?.description}
        />
        <FieldError messages={errors?.description} />
      </div>
    </div>
  );
}
