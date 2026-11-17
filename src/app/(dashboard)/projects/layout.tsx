import { ProjectSidebar } from "@/components/sidebar/project-sidebar";
import { TopBar } from "@/components/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ProjectsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <TopBar />
      <ProjectSidebar />
      <div className="flex flex-col w-screen mt-11">
        <main className="m-7">{children}</main>
      </div>
    </SidebarProvider>
  );
}
