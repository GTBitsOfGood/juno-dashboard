import { ProjectSidebar } from "@/components/sidebar/project-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopBar } from "@/components/top-bar";
import "../../../globals.css";
import { getProjectById } from "@/lib/project";

export default async function ProjectLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}>) {
  const { projectId } = await params;
  const { project } = await getProjectById(Number(projectId));

  return (
    <SidebarProvider>
      <ProjectSidebar
        currProjName={project.name}
        projectId={Number(projectId)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main>{children}</main>
      </div>
    </SidebarProvider>
  );
}
