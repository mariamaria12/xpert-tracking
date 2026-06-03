import {
  getProjectStatusBadgeClassName,
  getProjectStatusLabel,
} from "@/lib/services/projects/projectStatusStyles";
import { cn } from "@/lib/utils";

export default function ProjectStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const label = getProjectStatusLabel(status);

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        getProjectStatusBadgeClassName(status),
        className
      )}
    >
      {label}
    </span>
  );
}
