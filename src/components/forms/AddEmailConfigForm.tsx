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

const addEmailConfigSchema = z.object({
  id: z.number(),
  sendgridKey: z.string().nonempty(),
});

type AddEmailConfigFormProps = {
  projectId: number;
  sendGridKey?: string;
  isPending: boolean;
  onAddConfig: (sendgridKey: string) => void;
  isEditMode?: boolean;
};

const AddEmailConfigForm = ({
  projectId,
  sendGridKey,
  isPending,
  onAddConfig,
  isEditMode,
}: AddEmailConfigFormProps) => {
  /** Form to create a email config */
  const addEmailConfigForm = useForm({
    resolver: zodResolver(addEmailConfigSchema),
    defaultValues: {
      id: projectId,
      sendgridKey: sendGridKey ? sendGridKey : "SG",
    },
  });

  return (
    <Form {...addEmailConfigForm}>
      <form
        onSubmit={addEmailConfigForm.handleSubmit((data) =>
          onAddConfig(data.sendgridKey),
        )}
        className="space-y-6 rounded-lg"
      >
        <FormField
          control={addEmailConfigForm.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project ID</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
              <FormDescription>Project Id of this project.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={addEmailConfigForm.control}
          name="sendgridKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sendgrid Key</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Sendgrid Key of this project.</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">
          {isPending ? <Loader2 className="animate-spin" /> : <></>}
          {isEditMode ? "Edit Config" : "Create Config"}
        </Button>
      </form>
    </Form>
  );
};

export default AddEmailConfigForm;
