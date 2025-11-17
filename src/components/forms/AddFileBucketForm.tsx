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

const addFileBucketSchema = z.object({
  name: z.string().nonempty(),
  fileProviderName: z.string().nonempty(),
});

type AddFileBucketFormProps = {
  isPending: boolean;
  onAddBucket: (options: { name: string; fileProviderName: string }) => void;
  isEditMode?: boolean;
};

const AddFileBucketForm = ({
  isPending,
  onAddBucket,
  isEditMode,
}: AddFileBucketFormProps) => {
  /** Form to create a file bucket */
  const addFileBucketForm = useForm({
    resolver: zodResolver(addFileBucketSchema),
  });

  return (
    <Form {...addFileBucketForm}>
      <form
        onSubmit={addFileBucketForm.handleSubmit((data) =>
          onAddBucket({
            name: data.name,
            fileProviderName: data.fileProviderName,
          })
        )}
        className="space-y-6 rounded-lg"
      >
        <FormField
          control={addFileBucketForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bucket Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Name of this bucket.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={addFileBucketForm.control}
          name="fileProviderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Provider Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Name of file provider to host bucket.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">
          {isPending ? <Loader2 className="animate-spin" /> : <></>}
          {isEditMode ? "Edit Bucket" : "Create Bucket"}
        </Button>
      </form>
    </Form>
  );
};

export default AddFileBucketForm;
