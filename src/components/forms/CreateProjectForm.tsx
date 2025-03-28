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
import { createProjectAction } from "@/lib/actions";
import { Button } from "../ui/button";

const createProjectSchema = z.object({
  projectName: z.string().min(2, "Name must be at least 2 characters"),
});

const CreateProjectForm = () => {
  /** Form to create a user */
  const createUserForm = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: "",
    },
  });

  const handleCreateProject = async (
    data: Required<z.infer<typeof createProjectSchema>>,
  ) => {
    try {
      const result = await createProjectAction(data);
      if (result.success) {
        alert("Project created successfully!");
      } else {
        alert("Project failed to be created.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Form {...createUserForm}>
      <form
        onSubmit={createUserForm.handleSubmit(handleCreateProject)}
        className="space-y-6 rounded-lg"
      >
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
