import FieldError from "@/ui/forms/FieldError";
import { formInputClassName } from "@/ui/forms/formClasses";

import type { ClientFormErrors } from "@/lib/services/client/clients.types";

export type ClientFormValues = {
  companyName: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  billingAddress: string;
  deliveryAddress: string;
  status: string;
  notes: string;
};

type ClientFormFieldsProps = {
  idPrefix?: string;
  errors?: ClientFormErrors;
  values?: ClientFormValues;
};

function fieldId(prefix: string | undefined, name: string) {
  return prefix ? `${name}-${prefix}` : name;
}

export function clientFormValuesFromRow(row: {
  companyName: string;
  industry: string | null;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  billingAddress: string | null;
  deliveryAddress: string | null;
  status: string | null;
  notes: string | null;
}): ClientFormValues {
  return {
    companyName: row.companyName ?? "",
    industry: row.industry ?? "",
    contactPerson: row.contactPerson ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    billingAddress: row.billingAddress ?? "",
    deliveryAddress: row.deliveryAddress ?? "",
    status: row.status ?? "",
    notes: row.notes ?? "",
  };
}

export default function ClientFormFields({ idPrefix, errors, values }: ClientFormFieldsProps) {
  const isEdit = values !== undefined;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={fieldId(idPrefix, "companyName")}
            className="mb-1 block text-sm text-white/70"
          >
            Company name
          </label>
          <input
            id={fieldId(idPrefix, "companyName")}
            name="companyName"
            className={formInputClassName}
            placeholder={isEdit ? undefined : "Metal Construct SRL"}
            defaultValue={values?.companyName}
            required
          />
          <FieldError messages={errors?.companyName} />
        </div>
        <div>
          <label
            htmlFor={fieldId(idPrefix, "industry")}
            className="mb-1 block text-sm text-white/70"
          >
            Industry
          </label>
          <input
            id={fieldId(idPrefix, "industry")}
            name="industry"
            className={formInputClassName}
            placeholder={isEdit ? undefined : "Construction"}
            defaultValue={values?.industry}
          />
          <FieldError messages={errors?.industry} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={fieldId(idPrefix, "contactPerson")}
            className="mb-1 block text-sm text-white/70"
          >
            Contact person
          </label>
          <input
            id={fieldId(idPrefix, "contactPerson")}
            name="contactPerson"
            className={formInputClassName}
            placeholder={isEdit ? undefined : "Andrei Pop"}
            defaultValue={values?.contactPerson}
          />
          <FieldError messages={errors?.contactPerson} />
        </div>
        <div>
          <label htmlFor={fieldId(idPrefix, "email")} className="mb-1 block text-sm text-white/70">
            Contact email
          </label>
          <input
            id={fieldId(idPrefix, "email")}
            name="email"
            type="email"
            className={formInputClassName}
            placeholder={isEdit ? undefined : "office@company.com"}
            defaultValue={values?.email}
            autoComplete="email"
          />
          <FieldError messages={errors?.email} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId(idPrefix, "phone")} className="mb-1 block text-sm text-white/70">
            Phone
          </label>
          <input
            id={fieldId(idPrefix, "phone")}
            name="phone"
            type="tel"
            className={formInputClassName}
            placeholder={isEdit ? undefined : "+40740111001"}
            defaultValue={values?.phone}
            autoComplete="tel"
          />
          <FieldError messages={errors?.phone} />
        </div>
        <div>
          <label htmlFor={fieldId(idPrefix, "status")} className="mb-1 block text-sm text-white/70">
            Status
          </label>
          <input
            id={fieldId(idPrefix, "status")}
            name="status"
            className={formInputClassName}
            placeholder={isEdit ? undefined : "active"}
            defaultValue={values?.status}
          />
          <FieldError messages={errors?.status} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={fieldId(idPrefix, "billingAddress")}
            className="mb-1 block text-sm text-white/70"
          >
            Billing address
          </label>
          <input
            id={fieldId(idPrefix, "billingAddress")}
            name="billingAddress"
            className={formInputClassName}
            placeholder={isEdit ? undefined : "Cluj-Napoca, Str. Fabricii 12"}
            defaultValue={values?.billingAddress}
          />
          <FieldError messages={errors?.billingAddress} />
        </div>
        <div>
          <label
            htmlFor={fieldId(idPrefix, "deliveryAddress")}
            className="mb-1 block text-sm text-white/70"
          >
            Delivery address
          </label>
          <input
            id={fieldId(idPrefix, "deliveryAddress")}
            name="deliveryAddress"
            className={formInputClassName}
            placeholder={isEdit ? undefined : "Cluj-Napoca, Industrial Park"}
            defaultValue={values?.deliveryAddress}
          />
          <FieldError messages={errors?.deliveryAddress} />
        </div>
      </div>

      <div>
        <label htmlFor={fieldId(idPrefix, "notes")} className="mb-1 block text-sm text-white/70">
          Notes
        </label>
        <textarea
          id={fieldId(idPrefix, "notes")}
          name="notes"
          className={formInputClassName}
          rows={3}
          placeholder={isEdit ? undefined : "Optional internal notes..."}
          defaultValue={values?.notes}
        />
        <FieldError messages={errors?.notes} />
      </div>
    </div>
  );
}
