import type { ReactNode } from "react";

export default function AnalyticsCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card hover:translate-y-0 ${className ?? ""}`}>
      <div className="mb-5">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {description ? <p className="mt-1 text-sm text-white/50">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
