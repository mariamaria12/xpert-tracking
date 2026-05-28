export type ClientRow = {
  id: string;
  companyName: string;
  industry: string | null;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  deliveryAddress: string | null;
  billingAddress: string | null;
  status: string | null;
  notes: string | null;
  projectCount: number;
};

export type ClientRowsResult =
  | { rows: ClientRow[]; error?: undefined }
  | { rows: ClientRow[]; error: string };

export type ClientCreateInput = {
  companyName: string;
  industry?: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  billingAddress?: string;
  deliveryAddress?: string;
  status?: string;
  notes?: string;
};

export type ClientUpdateInput = ClientCreateInput & {
  id: string;
};

export type ClientFormErrors = Partial<
  Record<
    | "companyName"
    | "industry"
    | "contactPerson"
    | "email"
    | "phone"
    | "billingAddress"
    | "deliveryAddress"
    | "status"
    | "notes"
    | "id",
    string[]
  >
>;

export type ClientFormState =
  | {
      success?: boolean;
      message?: string;
      errors?: ClientFormErrors;
    }
  | undefined;
