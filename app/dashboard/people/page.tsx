import AddEmployeeDialog from "./AddEmployeeDialog";
import PeopleTable from "./PeopleTable";
import { getPeopleRows } from "./getPeopleRows";

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
