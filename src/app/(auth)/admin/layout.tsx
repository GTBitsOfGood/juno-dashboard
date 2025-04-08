import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import "../../globals.css";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main>{children}</main>
    </SidebarProvider>
  );
}
