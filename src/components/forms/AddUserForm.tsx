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
import { createUserAction } from "@/lib/actions";
import { toast } from "sonner";
import { UserColumn } from "../usertable/columns";

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type CreateUserFormProps = {
  onUserAdd: (newUser: UserColumn) => void;
  onClose?: () => void;
};

const CreateUserForm = ({ onUserAdd, onClose }: CreateUserFormProps) => {
  /** Form to create a user */
  const createUserForm = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleCreateUser = async (
    data: Required<z.infer<typeof createUserSchema>>,
  ) => {
    try {
      const result = await createUserAction(data);
      if (result.success) {
        toast.success("Success", {
          description: "User successfully created!",
        });
        const newUser = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.type,
          projects: result.user.projectIds,
        };
        if (onUserAdd) {
          onUserAdd(newUser);
        }
        if (onClose) {
          onClose();
        }
      } else {
        toast.error("Error", {
          description: result.error,
        });
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
        <Button type="submit">Create User</Button>
      </form>
    </Form>
  );
};

export default CreateUserForm;
