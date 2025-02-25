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

// TODO: As soon as JWT gets merged into Juno, replace with credentials
const ADMIN_EMAIL: string = "test-superadmin@test.com";
const ADMIN_PASSWORD: string = "test-password";

async function getData(): Promise<ProjectColumn[]> {
  const client = getJunoInstance();

  const { projects } = await client.project.getProjects(
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
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
