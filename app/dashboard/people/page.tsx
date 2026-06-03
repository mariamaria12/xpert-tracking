import AddEmployeeDialog from "./AddEmployeeDialog";
import { getPeopleRows } from "./getPeopleRows";
import PeopleTable from "./PeopleTable";

export default async function PeoplePage() {
  const { rows, error } = await getPeopleRows();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">People</h1>
        <AddEmployeeDialog />
      </div>
      <PeopleTable rows={rows} error={error} />
    </div>
  );
}
