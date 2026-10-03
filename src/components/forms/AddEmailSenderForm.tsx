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
import { Label } from "../ui/label";

const addEmailSenderSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  name: z.string().min(1, "Required"),
  replyTo: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  nickname: z.string().optional(),
  address: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  zip: z.string().min(1, "Required"),
  country: z.string().min(1, "Required"),
});

export type AddEmailSenderFormValues = z.infer<typeof addEmailSenderSchema>;

type AddEmailSenderFormProps = {
  projectId: number;
  isPending: boolean;
  onAddSender: (values: AddEmailSenderFormValues) => void;
};

const fields: {
  name: keyof AddEmailSenderFormValues;
  label: string;
  placeholder?: string;
  description?: string;
}[] = [
  {
    name: "email",
    label: "From Email",
    placeholder: "noreply@example.com",
    description: "The address emails will be sent from.",
  },
  { name: "name", label: "From Name", placeholder: "Example Club" },
  {
    name: "replyTo",
    label: "Reply-To Email (optional)",
    description: "Defaults to the from email.",
  },
  {
    name: "nickname",
    label: "Nickname (optional)",
    description: "Only visible in SendGrid. Defaults to the from name.",
  },
  { name: "address", label: "Address", placeholder: "123 Main St." },
  { name: "city", label: "City", placeholder: "Atlanta" },
  { name: "state", label: "State", placeholder: "GA" },
  { name: "zip", label: "Zip Code", placeholder: "30332" },
  { name: "country", label: "Country", placeholder: "USA" },
];

const AddEmailSenderForm = ({
  projectId,
  isPending,
  onAddSender,
}: AddEmailSenderFormProps) => {
  /** Form to register an email sender */
  const addEmailSenderForm = useForm({
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
    <Form {...addEmailSenderForm}>
      <form
        onSubmit={addEmailSenderForm.handleSubmit((data) => onAddSender(data))}
        className="space-y-4 rounded-lg"
      >
        <div className="space-y-2">
          <Label>Project ID</Label>
          <Input value={projectId} disabled />
        </div>
        {fields.map(({ name, label, placeholder, description }) => (
          <FormField
            key={name}
            control={addEmailSenderForm.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input placeholder={placeholder} {...field} />
                </FormControl>
                <FormMessage />
                {description && <FormDescription>{description}</FormDescription>}
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : <></>}
          Register Sender
        </Button>
      </form>
    </Form>
  );
};

export default AddEmailSenderForm;
