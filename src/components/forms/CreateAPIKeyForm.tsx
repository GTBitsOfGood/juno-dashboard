"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import * as z from "zod";
import { useForm } from "react-hook-form";
import { CircleX, Loader2 } from "lucide-react";
import { useState } from "react";
import { Alert } from "../ui/alert";
import { ProjectIdentifier } from "juno-sdk/build/main/lib/identifiers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export enum Environment {
  Dev = "Dev",
  Prod = "Prod",
}

const createAPIKeySchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters"),
  environment: z.nativeEnum(Environment),
  projectName: z.string().min(1, "Project name must be at least 1 character"),
});

export type APIKey = {
  description: string;
  environment: Environment;
  project: ProjectIdentifier;
};

type CreateAPIKeyFormProps = {
  onKeyAdd: (newKey: APIKey) => void;
  onClose?: () => void;
};

const CreateAPIKeyForm = ({ onKeyAdd, onClose }: CreateAPIKeyFormProps) => {
  /** Form to create a user */
  const createUserForm = useForm({
    resolver: zodResolver(createAPIKeySchema),
    defaultValues: {
      description: "",
      environment: Environment.Dev,
      projectName: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateUser = async (
    data: Required<z.infer<typeof createAPIKeySchema>>,
  ) => {
    setLoading(true);
    try {
      // TODO: Placeholder until SDK has createKey authentication added
      const key: APIKey = {
        environment: data.environment,
        description: data.description,
        project: { name: data.projectName },
      };

      onKeyAdd(key);
      setLoading(false);

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setError(error);
    }
  };

  return (
    <Form {...createUserForm}>
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
        onSubmit={createUserForm.handleSubmit(handleCreateUser)}
        className="space-y-6 rounded-lg"
      >
        <FormField
          control={createUserForm.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Name of the project to add an API key
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={createUserForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Description of what this API key is intended for. Please be
                descriptive with your use case
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={createUserForm.control}
          name="environment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Environment</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(Environment).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {loading ? <Loader2 className="animate-spin" /> : <></>}
          Create API Key
        </Button>
      </form>
    </Form>
  );
};

export default CreateAPIKeyForm;
