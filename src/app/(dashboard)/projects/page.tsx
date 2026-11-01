"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SkeletonRows from "@/components/table/SkeletonRows";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProjects } from "@/lib/sdkActions";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadProjects() {
      setLoading(true);
      setError(false);
      try {
        const result = await getProjects();
        if (!result.success) throw new Error("Failed to fetch projects");
        if (active)
          setProjects(
            result.projects.map((project) => ({
              id: String(project.id),
              name: project.name,
            })),
          );
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadProjects();
    return () => {
      active = false;
    };
  }, [attempt]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold">Projects</h1>
      <div className="rounded-md border">
        <Table aria-label="Projects" aria-busy={loading}>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">ID</TableHead>
              <TableHead scope="col" className="w-full">
                Name
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                <TableRow className="sr-only">
                  <TableCell colSpan={2} role="status">
                    Loading projects...
                  </TableCell>
                </TableRow>
                <SkeletonRows numRows={5} numCells={2} />
              </>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={2} className="py-8 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <p role="alert">
                      Unable to load projects. Please try again.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setAttempt((value) => value + 1)}
                    >
                      Try again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="py-8 text-center">
                  <div className="flex flex-col gap-1">
                    <p>No projects available.</p>
                    <p className="text-muted-foreground">
                      Contact your administrator to request a new project or
                      access to an existing project.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="p-0">
                    <Link
                      href={`/projects/${project.id}`}
                      className="block p-2"
                      aria-label={`Open ${project.name}, project ${project.id}`}
                    >
                      {project.id}
                    </Link>
                  </TableCell>
                  <TableCell className="p-0">
                    <Link
                      href={`/projects/${project.id}`}
                      className="block p-2"
                      tabIndex={-1}
                    >
                      {project.name}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
