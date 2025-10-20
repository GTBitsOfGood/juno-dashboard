import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert } from "../ui/alert";
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

const addFileConfigSchema = z.object({
  id: z.number(),
});

type AddFileConfigFormProps = {
  projectId: number;
  error?: string;
  isPending: boolean;
  onAddConfig: () => void;
};

const AddFileConfigForm = ({
  projectId,
  error,
  isPending,
  onAddConfig,
}: AddFileConfigFormProps) => {
  /** Form to create a file config */
  const addFileConfigForm = useForm({
    resolver: zodResolver(addFileConfigSchema),
    defaultValues: {
      id: projectId,
    },
  });

  return (
    <Form {...addFileConfigForm}>
      {error ? (
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
        onSubmit={addFileConfigForm.handleSubmit(onAddConfig)}
        className="space-y-6 rounded-lg"
      >
        <FormField
          control={addFileConfigForm.control}
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
        <Button type="submit">
          {isPending ? <Loader2 className="animate-spin" /> : <></>}
          Create Config
        </Button>
      </form>
    </Form>
  );
};

export default AddFileConfigForm;
