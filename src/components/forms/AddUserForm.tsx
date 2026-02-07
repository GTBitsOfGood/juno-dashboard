import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
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
import { createUserAction, linkUserToProjectId } from "@/lib/actions";
import { UserColumn } from "../usertable/columns";
import { CircleX, Loader2 } from "lucide-react";
import { useState } from "react";
import { Alert } from "../ui/alert";
import { toast } from "sonner";

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type CreateUserFormProps = {
  onUserAdd: (newUser: UserColumn) => void;
  onClose?: () => void;
  projectIds?: number[];
};

const CreateUserForm = ({
  onUserAdd,
  onClose,
  projectIds,
}: CreateUserFormProps) => {
  /** Form to create a user */
  const createUserForm = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateUser = async (
    data: Required<z.infer<typeof createUserSchema>>
  ) => {
    setLoading(true);
    try {
      const result = await createUserAction(data);
      if (result.success) {
        const newUser = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.type,
          projects: result.user.projectIds,
        };

        // Link user to project if originatingProjectId is provided
        if (projectIds && projectIds.length > 0) {
          const projectPromises: Promise<{success:boolean}>[] = [];

          for (const projectId of projectIds) {
            projectPromises.push(
              linkUserToProjectId({
                projectId: projectId,
                userId: String(result.user.id),
              })
            );
          }

          const linkResults = await Promise.all(projectPromises);
          const failedLinks = linkResults.filter((r) => !r.success);

          if (!newUser.projects) {
            newUser.projects = [];
          }

          for (let i = 0; i < linkResults.length; i++) {
            if (linkResults[i].success) {
              newUser.projects.push(projectIds[i]);
            }
          }

          newUser.projects = Array.from(new Set(newUser.projects));

          // Show warning if any links failed
          if (failedLinks.length > 0) {
            toast.warning("User created with incomplete project links", {
              description: `User was created successfully, but failed to link to ${failedLinks.length} project${failedLinks.length > 1 ? "s" : ""}. Please manually add them to the project.`,
            });
          }
        }

        if (onUserAdd) {
          onUserAdd(newUser);
        }
        if (onClose) {
          onClose();
        }
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      toast.error("Failed to create user", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      setLoading(false);
    }
  };

  return (
    <Form {...createUserForm}>
      {error.length > 0 ? (
        <Alert>
          <div className="flex space-x-2 text-red-300 items-center align-middle">
            <CircleX className="h-4 w-4" />
            <div>Error: {error}</div>
          </div>
        </Alert>
      ) : (
        <></>
      )}
      <form
        onSubmit={createUserForm.handleSubmit(handleCreateUser)}
        className="space-y-6 rounded-lg"
      >
        <FormField
          control={createUserForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Name for the new User.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={createUserForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Email for the new User.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={createUserForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Password for the new User.</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">
          {loading ? <Loader2 className="animate-spin" /> : <></>}
          Create User
        </Button>
      </form>
    </Form>
  );
};

export default CreateUserForm;
