import { getJunoInstance } from "@/lib/juno";
import { ProjectColumn, columns } from "./columns";
import { ProjectDataTable } from "./data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCredentialsFromJWT } from "@/lib/actions";

async function getData(): Promise<ProjectColumn[]> {
  const client = getJunoInstance();

  const jwt = await getCredentialsFromJWT();

  const { projects } = await client.project.getProjects(
    jwt
  );

  return projects.map((project) => ({
    id: project.id.toString(),
    name: project.name,
  }));
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto px-10 py-10">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Projects</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1>Projects</h1>

      <ProjectDataTable columns={columns} data={data} />
    </div>
  );
}
