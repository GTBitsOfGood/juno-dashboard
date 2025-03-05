"use client";
import { linkUserToProject } from "@/lib/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const linkUserToProjectSchema = z.object({
  userId: z.string(),
  projectName: z.string().min(1, "Project Name is required"),
  adminEmail: z.string().email("Invalid admin email"),
  adminPassword: z.string().min(6, "Invalid admin password"),
});

const AdminPage = () => {
  /** Form to link user to a project */
  const linkUserToProjectForm = useForm({
    resolver: zodResolver(linkUserToProjectSchema),
    defaultValues: {
      userId: "",
      projectName: "",
      adminEmail: "",
      adminPassword: "",
    },
  });

  const handleLinkUserToProject = async (
    data: Required<z.infer<typeof linkUserToProjectSchema>>,
  ) => {
    try {
      const result = await linkUserToProject(data);
      if (result.success) {
        alert("User successfully linked to project!");
      } else {
        alert("User not linked to project.");
      }
    } catch (error) {
      console.error("Error linking user to project:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Page</h1>

      {/* Set User Type Form */}

      {/* Link User to Project Form */}
      <Form {...linkUserToProjectForm}>
        <form
          onSubmit={linkUserToProjectForm.handleSubmit(handleLinkUserToProject)}
          className="space-y-4 border p-4 rounded-lg"
        >
          <h2 className="text-lg font-semibold">Link User to Project</h2>
          <FormField
            control={linkUserToProjectForm.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={linkUserToProjectForm.control}
            name="adminEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={linkUserToProjectForm.control}
            name="adminPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Password</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={linkUserToProjectForm.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Link User</Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminPage;
