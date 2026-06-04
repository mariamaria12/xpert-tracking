import AddClientDialog from "./AddClientDialog";
import ClientsTable from "./ClientsTable";
import { getClientRows } from "./getClientRows";

export default async function ClientsPage() {
  const { rows, error } = await getClientRows();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-end gap-4">
        <AddClientDialog />
      </div>
      <ClientsTable rows={rows} error={error} />
    </div>
  );
}
