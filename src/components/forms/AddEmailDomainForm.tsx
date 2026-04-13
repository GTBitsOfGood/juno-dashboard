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

const addEmailDomainSchema = z.object({
  domain: z.string().nonempty("Domain is required"),
  subdomain: z.string().optional(),
});

type AddEmailDomainFormProps = {
  isPending: boolean;
  onAddDomain: (options: { domain: string; subdomain?: string }) => void;
};

const AddEmailDomainForm = ({
  isPending,
  onAddDomain,
}: AddEmailDomainFormProps) => {
  const form = useForm({
    resolver: zodResolver(addEmailDomainSchema),
    defaultValues: {
      domain: "",
      subdomain: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          onAddDomain({
            domain: data.domain,
            subdomain: data.subdomain || undefined,
          }),
        )}
        className="space-y-4 rounded-lg"
      >
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <Input placeholder="example.com" {...field} />
              </FormControl>
              <FormDescription>
                The domain you want to authenticate for sending emails
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subdomain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subdomain (optional)</FormLabel>
              <FormControl>
                <Input placeholder="mail" {...field} />
              </FormControl>
              <FormDescription>
                Optional subdomain for the authenticated domain
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : null}
          Register Domain
        </Button>
      </form>
    </Form>
  );
};

export default AddEmailDomainForm;
