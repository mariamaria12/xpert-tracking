import FieldError from "@/ui/forms/FieldError";
import { formInputClassName } from "@/ui/forms/formClasses";

import type { EmployeeFormErrors } from "@/lib/services/people/people.types";

export type EmployeeFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
};

type EmployeeFormFieldsProps = {
  idPrefix?: string;
  errors?: EmployeeFormErrors;
  values?: EmployeeFormValues;
};

function fieldId(prefix: string | undefined, name: string) {
  return prefix ? `${name}-${prefix}` : name;
}

export function employeeFormValuesFromRow(row: {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  role: string | null;
}): EmployeeFormValues {
  return {
    firstName: row.firstName ?? "",
    lastName: row.lastName ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    role: row.role ?? "",
  };
}

export default function EmployeeFormFields({ idPrefix, errors, values }: EmployeeFormFieldsProps) {
  const isEdit = values !== undefined;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={fieldId(idPrefix, "firstName")}
            className="mb-1 block text-sm text-white/70"
          >
            First name
          </label>
          <input
            id={fieldId(idPrefix, "firstName")}
            name="firstName"
            className={formInputClassName}
            placeholder={isEdit ? undefined : "Ion"}
            defaultValue={values?.firstName}
            required
            autoComplete="given-name"
          />
          <FieldError messages={errors?.firstName} />
        </div>
        <div>
          <label
            htmlFor={fieldId(idPrefix, "lastName")}
            className="mb-1 block text-sm text-white/70"
          >
            Last name
          </label>
          <input
            id={fieldId(idPrefix, "lastName")}
            name="lastName"
            className={formInputClassName}
            placeholder={isEdit ? undefined : "Pop"}
            defaultValue={values?.lastName}
            required
            autoComplete="family-name"
          />
          <FieldError messages={errors?.lastName} />
        </div>
      </div>

      <div>
        <label htmlFor={fieldId(idPrefix, "email")} className="mb-1 block text-sm text-white/70">
          Email
        </label>
        <input
          id={fieldId(idPrefix, "email")}
          name="email"
          type="email"
          className={formInputClassName}
          placeholder={isEdit ? undefined : "ion.pop@company.com"}
          defaultValue={values?.email}
          autoComplete="email"
        />
        <FieldError messages={errors?.email} />
      </div>

      <div>
        <label htmlFor={fieldId(idPrefix, "phone")} className="mb-1 block text-sm text-white/70">
          Phone
        </label>
        <input
          id={fieldId(idPrefix, "phone")}
          name="phone"
          type="tel"
          className={formInputClassName}
          placeholder={isEdit ? undefined : "+40740111222"}
          defaultValue={values?.phone}
          autoComplete="tel"
        />
        <FieldError messages={errors?.phone} />
      </div>

      <div>
        <label htmlFor={fieldId(idPrefix, "role")} className="mb-1 block text-sm text-white/70">
          Role
        </label>
        <input
          id={fieldId(idPrefix, "role")}
          name="role"
          className={formInputClassName}
          placeholder={isEdit ? undefined : "Welder"}
          defaultValue={values?.role}
        />
        <FieldError messages={errors?.role} />
      </div>
    </div>
  );
}
