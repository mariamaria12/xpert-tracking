import { cn } from "@/lib/utils";

import { formatProjectStatusLabel } from "@/lib/services/projects/projectStatuses";

export default function ProjectStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const normalized = status.trim().toLowerCase();

  const styles =
    normalized === "completed"
      ? "bg-emerald-400/10 text-emerald-400"
      : normalized === "cancelled"
        ? "bg-red-400/10 text-red-300"
        : normalized === "on_hold"
          ? "bg-amber-400/10 text-amber-300"
          : normalized === "draft" ||
              normalized === "quoted" ||
              normalized === "approved"
            ? "bg-white/10 text-white/50"
            : "bg-cyan-400/10 text-cyan-400";

  const label = status.trim() ? formatProjectStatusLabel(status) : "—";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        styles,
        className,
      )}
    >
      {label}
    </span>
  );
}
