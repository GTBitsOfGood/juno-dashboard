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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const addFileProviderSchema = z.object({
  publicAccessKey: z.string().nonempty(),
  privateAccessKey: z.string().nonempty(),
  type: z.string().nonempty(),
  providerName: z.string().nonempty(),
  baseUrl: z.string().nonempty().url(),
});

type AddFileProviderFormProps = {
  existingProviderData?: z.infer<typeof addFileProviderSchema>;
  isPending: boolean;
  onAddProvider: (options: z.infer<typeof addFileProviderSchema>) => void;
  isEditMode?: boolean;
};

const AddFileProviderForm = ({
  existingProviderData,
  isPending,
  onAddProvider,
  isEditMode,
}: AddFileProviderFormProps) => {
  /** Form to create a file provider */
  const addFileProviderForm = useForm({
    resolver: zodResolver(addFileProviderSchema),
    defaultValues: existingProviderData,
  });

  const supportedTypes = ["S3", "Azure"];

  return (
    <Form {...addFileProviderForm}>
      <form
        onSubmit={addFileProviderForm.handleSubmit((data) => {
          onAddProvider(data);
        })}
        className="space-y-6 rounded-lg"
      >
        <FormField
          control={addFileProviderForm.control}
          name="providerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isEditMode} />
              </FormControl>
              <FormMessage />
              <FormDescription>Name of this file provider.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={addFileProviderForm.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider Type</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a provider type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {supportedTypes.map((type, index) => (
                        <SelectItem key={index} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              <FormDescription>Type of file provider.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={addFileProviderForm.control}
          name="baseUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Url</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Base url of this file provider.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={addFileProviderForm.control}
          name="publicAccessKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Public Access Key</FormLabel>
              <FormControl>
                <Input type={"password"} {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Your S3 accessKeyId or Azure accountName.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={addFileProviderForm.control}
          name="privateAccessKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Private Access Key</FormLabel>
              <FormControl>
                <Input type={"password"} {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Your S3 secretAccessKey or Azure accountKey.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">
          {isPending ? <Loader2 className="animate-spin" /> : <></>}
          {isEditMode ? "Edit Provider" : "Create Provider"}
        </Button>
      </form>
    </Form>
  );
};

export default AddFileProviderForm;
