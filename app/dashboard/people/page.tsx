import PeopleTable from "./PeopleTable";
import { getPeopleRows } from "./getPeopleRows";

export default async function PeoplePage() {
  const { rows, error } = await getPeopleRows();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">People</h1>
      <PeopleTable rows={rows} error={error} />
    </div>
  );
}
