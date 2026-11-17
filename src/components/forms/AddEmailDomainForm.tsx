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

const addEmailDomainSchema = z.object({
  domain: z.string().trim().min(1, "Enter a domain"),
  subdomain: z.string().optional(),
});

type AddEmailDomainFormProps = {
  projectId: number;
  isRegistering: boolean;
  isVerifying: boolean;
  onRegister: (domain: string, subdomain?: string) => void;
  onVerify: (domain: string) => void;
};

const AddEmailDomainForm = ({
  projectId,
  isRegistering,
  isVerifying,
  onRegister,
  onVerify,
}: AddEmailDomainFormProps) => {
  /** Form to register a domain, or verify one that is already registered */
  const addEmailDomainForm = useForm({
    resolver: zodResolver(addEmailDomainSchema),
    defaultValues: {
      domain: "",
      subdomain: "",
    },
  });

  const isBusy = isRegistering || isVerifying;

  const handleVerify = async () => {
    if (await addEmailDomainForm.trigger("domain")) {
      onVerify(addEmailDomainForm.getValues("domain"));
    }
  };

  return (
    <Form {...addEmailDomainForm}>
      <form
        onSubmit={addEmailDomainForm.handleSubmit((data) =>
          onRegister(data.domain, data.subdomain),
        )}
        className="space-y-4 rounded-lg"
      >
        <div className="space-y-2">
          <Label>Project ID</Label>
          <Input value={projectId} disabled />
        </div>
        <FormField
          control={addEmailDomainForm.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <Input placeholder="example.com" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                The domain you own, without https:// or www.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={addEmailDomainForm.control}
          name="subdomain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subdomain (optional)</FormLabel>
              <FormControl>
                <Input placeholder="mail" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Only used when registering a new domain.
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isBusy}>
            {isRegistering ? <Loader2 className="animate-spin" /> : <></>}
            Register Domain
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            onClick={handleVerify}
          >
            {isVerifying ? <Loader2 className="animate-spin" /> : <></>}
            Verify Domain
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddEmailDomainForm;
