import { ProjectSidebar } from "@/components/sidebar/project-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getProjectById } from "@/lib/project";
import "../../../globals.css";

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
      <main>{children}</main>
    </SidebarProvider>
  );
}
