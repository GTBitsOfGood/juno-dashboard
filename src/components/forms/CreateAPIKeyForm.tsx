"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createKeyAction } from "@/lib/actions";
import { ProjectIdentifier } from "juno-sdk/build/main/lib/identifiers";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export enum Environment {
  dev = "dev",
  prod = "prod",
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
  projects?: string[];
};

const CreateAPIKeyForm = ({
  onKeyAdd,
  onClose,
  projects = [],
}: CreateAPIKeyFormProps) => {
  const createApiKeyForm = useForm({
    resolver: zodResolver(createAPIKeySchema),
    defaultValues: {
      description: "",
      environment: Environment.dev,
      projectName: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const handleCreateApiKey = async (
    data: Required<z.infer<typeof createAPIKeySchema>>,
  ) => {
    setLoading(true);
    try {
      const result = await createKeyAction({
        projectName: data.projectName,
        environment: data.environment,
        description: data.description,
      });

      if (!result.success) {
        setError(result.error ?? "Failed to create API key");
        setLoading(false);
        return;
      }

      const key: APIKey = {
        environment: data.environment,
        description: data.description,
        project: { name: data.projectName },
        value: result.apiKey,
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
        <Form {...createApiKeyForm}>
          {error.length > 0 && (
            <p className="text-xs text-red-400">Error: {error}</p>
          )}
          <form
            onSubmit={createApiKeyForm.handleSubmit(handleCreateApiKey)}
            className="flex flex-col gap-8"
          >
            <FormField
              control={createApiKeyForm.control}
              name="projectName"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Project Name</FormLabel>
                  <Popover
                    open={comboboxOpen}
                    onOpenChange={setComboboxOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={comboboxOpen}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value || "Select a project"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search projects..." />
                        <CommandList>
                          <CommandEmpty>No projects found.</CommandEmpty>
                          <CommandGroup>
                            {projects.map((project) => (
                              <CommandItem
                                key={project}
                                value={project}
                                onSelect={() => {
                                  field.onChange(project);
                                  setComboboxOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === project
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {project}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                  <FormDescription>
                    Name of the project to add an API key
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={createApiKeyForm.control}
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
              control={createApiKeyForm.control}
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
