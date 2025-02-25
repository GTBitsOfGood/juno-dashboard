import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { createProjectAction, createUserAction } from "@/lib/actions";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const createProjectSchema = z.object({
  projectName: z.string().min(2, "Name must be at least 2 characters"),
  superadminEmail: z.string().email("Invalid admin email"),
  superadminPassword: z.string().min(6, "Invalid admin password"),
});

const CreateProjectForm = () => {
  /** Form to create a user */
  const createUserForm = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: "",
      superadminEmail: "",
      superadminPassword: "",
    },
  });

  const handleCreateUser = async (
    data: Required<z.infer<typeof createProjectSchema>>,
  ) => {
    try {
      const result = await createProjectAction(data);
      if (result.success) {
        alert("User created successfully!");
      } else {
        alert("User failed to be created.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Form {...createUserForm}>
      <form
        onSubmit={createUserForm.handleSubmit(handleCreateUser)}
        className="space-y-6 rounded-lg"
      >
        <FormField
          control={createUserForm.control}
          name="superadminEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Your admin email credentials.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={createUserForm.control}
          name="superadminPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Your admin password credentials.
              </FormDescription>
            </FormItem>
          )}
        />
        <Separator className="mt-8 mb-8" />
        <FormField
          control={createUserForm.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Name for the new Project.</FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit">Create Project</Button>
      </form>
    </Form>
  );
};

export default CreateProjectForm;
