import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX, Loader2 } from "lucide-react";
import { useState } from "react";
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
  onConfigAdd: () => void;
  onClose?: () => void;
};

const AddFileConfigForm = ({
  projectId,
  onConfigAdd,
  onClose,
}: AddFileConfigFormProps) => {
  /** Form to create a file config */
  const addFileConfigForm = useForm({
    resolver: zodResolver(addFileConfigSchema),
    defaultValues: {
      id: projectId,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddFileConfig = async (
    data: Required<z.infer<typeof addFileConfigSchema>>
  ) => {
    setLoading(true);
    try {
      // TODO: use file service setup SDK method here
      // Remove this console.log when adding SDK method
      console.log("Use SDK method to add file config", data);

      const result = { success: true };
      if (result.success) {
        if (onConfigAdd) {
          onConfigAdd();
        }
        if (onClose) {
          onClose();
        }
      } else {
        setError("Failed to create new file config.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating file config:", error);
    }
  };

  return (
    <Form {...addFileConfigForm}>
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
        onSubmit={addFileConfigForm.handleSubmit(handleAddFileConfig)}
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
          {loading ? <Loader2 className="animate-spin" /> : <></>}
          Create Config
        </Button>
      </form>
    </Form>
  );
};

export default AddFileConfigForm;
