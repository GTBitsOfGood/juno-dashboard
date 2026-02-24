import { ProjectSidebar } from "@/components/sidebar/project-sidebar";
import { TopBar } from "@/components/top-bar";
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
      <TopBar />
      <ProjectSidebar
        currProjName={project.name}
        projectId={Number(projectId)}
      />
      <div className="flex flex-col w-screen mt-11">
        <main className="m-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
