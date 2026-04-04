import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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

const addEmailSenderSchema = z.object({
  email: z.string().min(1, "Email is required").email("Must be a valid email address"),
  name: z.string().min(1, "Name is required"),
  replyTo: z.string().email("Must be a valid email address").or(z.literal("")),
  nickname: z.string().min(1, "Nickname is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

type AddEmailSenderFormProps = {
  isPending: boolean;
  onAddSender: (options: {
    email: string;
    name: string;
    replyTo: string;
    nickname: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }) => void;
};

const AddEmailSenderForm = ({
  isPending,
  onAddSender,
}: AddEmailSenderFormProps) => {
  const form = useForm({
    resolver: zodResolver(addEmailSenderSchema),
    defaultValues: {
      email: "",
      name: "",
      replyTo: "",
      nickname: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          onAddSender({
            email: data.email!,
            name: data.name!,
            replyTo: data.replyTo ?? "",
            nickname: data.nickname!,
            address: data.address!,
            city: data.city!,
            state: data.state!,
            zip: data.zip!,
            country: data.country!,
          }),
        )}
        className="space-y-4 rounded-lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Email</FormLabel>
                <FormControl>
                  <Input placeholder="sender@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="replyTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reply To</FormLabel>
                <FormControl>
                  <Input placeholder="reply@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  Defaults to From Email if empty
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nickname</FormLabel>
                <FormControl>
                  <Input placeholder="My Sender" {...field} />
                </FormControl>
                <FormDescription>Only visible in SendGrid</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Atlanta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="GA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="30332" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="USA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : null}
          Register Sender
        </Button>
      </form>
    </Form>
  );
};

export default AddEmailSenderForm;
