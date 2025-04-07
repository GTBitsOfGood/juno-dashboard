"use client";

import { ProjectSidebar } from "@/components/sidebar/project-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import "../../../globals.css";
import { useParams } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { projectId } = useParams();

  return (
    <SidebarProvider>
      <ProjectSidebar projectId={ Number(projectId) }/>
      <main>{children}</main>
    </SidebarProvider>
  );
}
