"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/ui/dashboard/Sidebar";
import Topbar from "@/ui/dashboard/Topbar";
import { cn } from "@/lib/utils";

const MD_MEDIA_QUERY = "(min-width: 768px)";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(MD_MEDIA_QUERY);
    const syncWithViewport = () => setExpanded(media.matches);

    syncWithViewport();
    media.addEventListener("change", syncWithViewport);
    return () => media.removeEventListener("change", syncWithViewport);
  }, []);

  function toggleSidebar() {
    setExpanded((prev) => !prev);
  }

  return (
    <div className="min-h-screen">
      <Sidebar expanded={expanded} onToggle={toggleSidebar} />
      <main
        className={cn(
          "min-h-screen bg-[#0B1220] transition-[margin] duration-200",
          expanded ? "ml-64" : "ml-20",
        )}
      >
        <Topbar onToggleSidebar={toggleSidebar} sidebarExpanded={expanded} />
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
