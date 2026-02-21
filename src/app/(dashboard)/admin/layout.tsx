import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopBar } from "@/components/top-bar";
import "../../globals.css";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main>{children}</main>
      </div>
    </SidebarProvider>
  );
}
