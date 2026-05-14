"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Clock,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings2,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

const mainNav = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "People", href: "/dashboard/people", icon: Users },
  { label: "Timesheet", href: "/dashboard/timesheet", icon: Clock },
  { label: "Tools", href: "/dashboard/tools", icon: Wrench },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-[#111827]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-5">
        <Truck className="h-7 w-7 shrink-0 text-[#22D3EE]" aria-hidden />
        <span className="font-bold text-[#22D3EE]">trackingXpert</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {mainNav.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={active ? "nav-active" : "nav-idle"}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
        <div className="mt-auto flex flex-col gap-1 pt-4">
          <Link href="/dashboard/settings" className="nav-idle">
            <Settings2 className="h-5 w-5 shrink-0" aria-hidden />
            <span>Settings</span>
          </Link>
          <button
            type="button"
            className="nav-idle w-full text-left"
            onClick={() => router.push("/login")}
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
