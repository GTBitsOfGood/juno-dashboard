import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { createUserAction } from "@/lib/actions";
import { Separator } from "../ui/separator";

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  adminEmail: z.string().email("Invalid admin email"),
  adminPassword: z.string().min(6, "Invalid admin password"),
});

const CreateUserForm = () => {
  /** Form to create a user */
  const createUserForm = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      adminEmail: "",
      adminPassword: "",
    },
  });

  const handleCreateUser = async (
    data: Required<z.infer<typeof createUserSchema>>,
  ) => {
    try {
      const result = await createUserAction(data);
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
    < Form {...createUserForm}>
      <form
        onSubmit={createUserForm.handleSubmit(handleCreateUser)}
        className="space-y-6 rounded-lg"
      >
        <h2 className="text-lg font-semibold">Create User</h2>
        <FormField
          control={createUserForm.control}
          name="adminEmail"
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
          name="adminPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Your admin password credentials.</FormDescription>
            </FormItem>
          )}
        />
        <Separator className="mt-8 mb-8" />
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
    </Form >
  )
}

export default CreateUserForm;
