import AddEmployeeDialog from "./AddEmployeeDialog";
import { getPeopleRows } from "./getPeopleRows";
import PeopleTable from "./PeopleTable";

export default async function PeoplePage() {
  const { rows, error } = await getPeopleRows();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-end gap-4">
        <AddEmployeeDialog />
      </div>
      <PeopleTable rows={rows} error={error} />
    </div>
  );
}
