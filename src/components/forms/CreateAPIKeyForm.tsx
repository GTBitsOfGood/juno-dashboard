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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ProjectIdentifier } from "juno-sdk/build/main/lib/identifiers";
import { DarkCard } from "../ui/dark-card";
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
    } catch (error) {
      console.error("Error creating user:", error);
      setError(error);
    }
  };

  return (
    <DarkCard
      title="Create a New API Key"
      description="API Keys Allow you to access Juno microservices programmatically."
    >
      <Form {...createUserForm}>
        {error.length > 0 && (
          <p className="text-xs text-red-400">Error: {error}</p>
        )}
        <form
          onSubmit={createUserForm.handleSubmit(handleCreateUser)}
          className="flex flex-col gap-8 px-1 py-[10px]"
        >
          <FormField
            control={createUserForm.control}
            name="projectName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-[9px] space-y-0">
                <FormLabel className="text-[12px] font-semibold text-white leading-5">
                  Project Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-black border border-slate-900 h-[32px] rounded-[2px] text-white text-sm"
                  />
                </FormControl>
                <FormMessage />
                <FormDescription className="text-[11px] font-semibold text-slate-300 leading-5">
                  Name of the project to add an API key
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={createUserForm.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-[9px] space-y-0">
                <FormLabel className="text-[12px] font-semibold text-white leading-5">
                  Description
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-black border border-slate-900 h-[32px] rounded-[2px] text-white text-sm"
                  />
                </FormControl>
                <FormMessage />
                <FormDescription className="text-[11px] font-semibold text-slate-300 leading-5">
                  Description of the use case for this API key
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={createUserForm.control}
            name="environment"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-[9px] space-y-0">
                <FormLabel className="text-[12px] font-semibold text-white leading-5">
                  Environment
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="bg-black border border-slate-900 h-[32px] rounded-[2px] text-white text-sm">
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
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-slate-900 text-[12px] font-semibold h-[32px] rounded-[4px] w-[114px]"
          >
            {loading && <Loader2 className="animate-spin h-3 w-3 mr-1" />}
            Create API Key
          </Button>
        </form>
      </Form>
    </DarkCard>
  );
};

export default CreateAPIKeyForm;
