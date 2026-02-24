import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { TopBar } from "@/components/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import "../../globals.css";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <TopBar />
      <AdminSidebar />
      <div className="flex flex-col w-screen mt-11">
        <main className="m-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
