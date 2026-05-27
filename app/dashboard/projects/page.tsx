import ProjectsTable from "./ProjectsTable";
import { getProjectRows } from "./getProjectRows";

export default async function ProjectsPage() {
  const { rows, error } = await getProjectRows();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Projects</h1>
      <ProjectsTable rows={rows} error={error} />
    </div>
  );
}
