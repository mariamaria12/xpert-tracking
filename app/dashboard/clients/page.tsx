import AddClientDialog from "./AddClientDialog";
import ClientsTable from "./ClientsTable";
import { getClientRows } from "./getClientRows";

export default async function ClientsPage() {
  const { rows, error } = await getClientRows();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <AddClientDialog />
      </div>
      <ClientsTable rows={rows} error={error} />
    </div>
  );
}
