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

const addAnalyticsConfigSchema = z.object({
  id: z.number(),
  serverAnalyticsKey: z.string().nonempty(),
  clientAnalyticsKey: z.string().nonempty(),
});

type AddAnalyticsConfigFormProps = {
  projectId: number;
  serverAnalyticsKey?: string;
  clientAnalyticsKey?: string;
  isPending: boolean;
  onAddConfig?: (keys: {
    serverAnalyticsKey: string;
    clientAnalyticsKey: string;
  }) => void;
  onUpdateConfig?: (
    projectId: number,
    keys: {
      serverAnalyticsKey: string;
      clientAnalyticsKey: string;
    },
  ) => void;
  isEditMode?: boolean;
};

const AddAnalyticsConfigForm = ({
  projectId,
  serverAnalyticsKey,
  clientAnalyticsKey,
  isPending,
  onAddConfig,
  onUpdateConfig,
  isEditMode,
}: AddAnalyticsConfigFormProps) => {
  /** Form to create an analytics config */
  const addAnalyticsConfigForm = useForm({
    resolver: zodResolver(addAnalyticsConfigSchema),
    defaultValues: {
      id: projectId,
      serverAnalyticsKey: serverAnalyticsKey ? serverAnalyticsKey : "",
      clientAnalyticsKey: clientAnalyticsKey ? clientAnalyticsKey : "",
    },
  });

  return (
    <Form {...addAnalyticsConfigForm}>
      <form
        onSubmit={addAnalyticsConfigForm.handleSubmit((data) => {
          const keys = {
            serverAnalyticsKey: data.serverAnalyticsKey,
            clientAnalyticsKey: data.clientAnalyticsKey,
          };
          if (!isEditMode && onAddConfig) {
            onAddConfig(keys);
          } else if (isEditMode && onUpdateConfig) {
            onUpdateConfig(projectId, keys);
          }
        })}
        className="space-y-6 rounded-lg"
      >
        <FormField
          control={addAnalyticsConfigForm.control}
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
          control={addAnalyticsConfigForm.control}
          name="serverAnalyticsKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Analytics Key</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Server Analytics Key of this project.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={addAnalyticsConfigForm.control}
          name="clientAnalyticsKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Analytics Key</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Client Analytics Key of this project.
              </FormDescription>
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

export default AddAnalyticsConfigForm;
