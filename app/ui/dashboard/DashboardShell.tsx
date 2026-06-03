"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import Sidebar from "@/ui/dashboard/Sidebar";
import Topbar from "@/ui/dashboard/Topbar";

const MD_MEDIA_QUERY = "(min-width: 768px)";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const media = window.matchMedia(MD_MEDIA_QUERY);
    const onViewportChange = () => setExpanded(media.matches);

    media.addEventListener("change", onViewportChange);
    return () => media.removeEventListener("change", onViewportChange);
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
          expanded ? "ml-64" : "ml-20"
        )}
      >
        <Topbar onToggleSidebar={toggleSidebar} sidebarExpanded={expanded} />
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
