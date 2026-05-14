export default function TimesheetPage() {
  const columns = [
    "Employee",
    "Project",
    "Date",
    "Hours",
    "Status",
    "Actions",
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Timesheet</h1>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-white/5 text-xs uppercase tracking-wider text-white/50">
              {columns.map((col) => (
                <th key={col} className="p-4 font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2].map((row) => (
              <tr
                key={row}
                className="border-t border-white/10 text-white/20 transition hover:bg-white/5"
              >
                <td className="p-4">—</td>
                <td className="p-4">—</td>
                <td className="p-4">—</td>
                <td className="p-4">—</td>
                <td className="p-4">
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/30">
                    —
                  </span>
                </td>
                <td className="p-4">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
