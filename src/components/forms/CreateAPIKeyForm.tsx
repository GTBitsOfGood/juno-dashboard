"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectIdentifier } from "juno-sdk/build/main/lib/identifiers";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
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
  value: string;
};

type CreateAPIKeyFormProps = {
  onKeyAdd: (newKey: APIKey) => void;
  onClose?: () => void;
};

const CreateAPIKeyForm = ({ onKeyAdd, onClose }: CreateAPIKeyFormProps) => {
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
      const placeholderValue =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9." +
        "eyJzdWIiOiJ1c3ItcGxhY2Vob2xkZXIiLCJpYXQiOjE3MDgzMjgwMDB9." +
        "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      const key: APIKey = {
        environment: data.environment,
        description: data.description,
        project: { name: data.projectName },
        value: placeholderValue,
      };

      onKeyAdd(key);
      setLoading(false);

      if (onClose) {
        onClose();
      }
    } catch {
      setError("An error occurred while creating the API key");
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <CardTitle className="text-2xl mb-1">Create a New API Key</CardTitle>
        <CardDescription>
          API keys allow you to access Juno services programmatically.
        </CardDescription>
      </div>
      <CardContent>
        <Form {...createUserForm}>
          {error.length > 0 && (
            <p className="text-xs text-red-400">Error: {error}</p>
          )}
          <form
            onSubmit={createUserForm.handleSubmit(handleCreateUser)}
            className="flex flex-col gap-8"
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Description of the use case for this API key
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment" />
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
                  <FormDescription>
                    Select the environment this API key will be used in.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 w-fit"
            >
              {loading && <Loader2 className="animate-spin h-3 w-3 mr-1" />}
              Create API Key
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateAPIKeyForm;
