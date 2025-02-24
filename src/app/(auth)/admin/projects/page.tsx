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

async function getData(): Promise<ProjectColumn[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      name: "Project",
    },
    {
      id: "1",
      name: "Project",
    },
    {
      id: "1",
      name: "Project",
    },
    {
      id: "2",
      name: "Project",
    },
    {
      id: "2",
      name: "Project",
    },
    {
      id: "2",
      name: "Project",
    },
    {
      id: "2",
      name: "Project",
    },
  ];
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
