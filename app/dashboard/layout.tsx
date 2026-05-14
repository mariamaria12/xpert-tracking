import Sidebar from "@/ui/dashboard/Sidebar";
import Topbar from "@/ui/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-64 min-h-screen bg-[#0B1220]">
        <Topbar />
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
