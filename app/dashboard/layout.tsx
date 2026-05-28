import { redirect } from "next/navigation";

import DashboardShell from "@/ui/dashboard/DashboardShell";
import { getUser } from "@/lib/auth/supabaseAuth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
