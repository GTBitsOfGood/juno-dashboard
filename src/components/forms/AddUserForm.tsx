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
import { UserColumn } from "../usertable/columns";
import { CircleX, Loader2 } from "lucide-react";
import { useState } from "react";
import { Alert } from "../ui/alert";

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type CreateUserFormProps = {
  onUserAdd: (newUser: UserColumn) => void;
};

const CreateUserForm = ({ onUserAdd }: CreateUserFormProps) => {
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
    data: Required<z.infer<typeof createUserSchema>>,
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
        if (onUserAdd) {
          onUserAdd(newUser);
        }
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating user:", error);
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
