"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  registerJunoDomain,
  registerJunoSenderAddress,
  setupJunoEmail,
} from "@/lib/sdkUtils";

const sendgridFormSchema = z.object({
  apiKey: z.string().regex(/^SG\./, "SendGrid API key must start with 'SG.'"),
});

const domainFormSchema = z.object({
  domain: z.string(),
  subdomain: z.string(),
});

const registerSenderAddressFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required"),
  replyTo: z.string().email("Please enter a valid email address").optional(),
  nickname: z.string().min(1, "Nickname is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  country: z.string().min(1, "Country is required"),
});

const EmailServicePage = () => {
  const sendgridForm = useForm<z.infer<typeof sendgridFormSchema>>({
    resolver: zodResolver(sendgridFormSchema),
    defaultValues: { apiKey: "" },
  });
  const domainForm = useForm<z.infer<typeof domainFormSchema>>({
    resolver: zodResolver(domainFormSchema),
    defaultValues: { domain: "", subdomain: "" },
  });
  const registerSenderAddressForm = useForm<
    z.infer<typeof registerSenderAddressFormSchema>
  >({
    resolver: zodResolver(registerSenderAddressFormSchema),
    defaultValues: {
      email: "",
      name: "",
      replyTo: "",
      nickname: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  function onSubmitSendgridForm(values: z.infer<typeof sendgridFormSchema>) {
    setupJunoEmail(values.apiKey);
  }
  function onSubmitDomainForm(values: z.infer<typeof domainFormSchema>) {
    registerJunoDomain(values.domain, values.subdomain);
  }
  function onSubmitSenderAddressForm(
    values: z.infer<typeof registerSenderAddressFormSchema>,
  ) {
    registerJunoSenderAddress(
      values.email,
      values.name,
      values.replyTo,
      values.nickname,
      values.address,
      values.city,
      values.state,
      values.zip,
      values.country,
    );
  }
  return (
    <div className="space-y-8">
      <Form {...sendgridForm}>
        <form
          onSubmit={sendgridForm.handleSubmit(onSubmitSendgridForm)}
          className="space-y-4"
        >
          <FormField
            control={sendgridForm.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SendGrid API key</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <Form {...domainForm}>
        <form
          onSubmit={domainForm.handleSubmit(onSubmitDomainForm)}
          className="space-y-4"
        >
          <FormField
            control={domainForm.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={domainForm.control}
            name="subdomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subdomain</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <Form {...registerSenderAddressForm}>
        <form
          onSubmit={registerSenderAddressForm.handleSubmit(
            onSubmitSenderAddressForm,
          )}
          className="space-y-4"
        >
          <FormField
            control={registerSenderAddressForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerSenderAddressForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerSenderAddressForm.control}
            name="replyTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reply To</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerSenderAddressForm.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nickname</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerSenderAddressForm.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerSenderAddressForm.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerSenderAddressForm.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerSenderAddressForm.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerSenderAddressForm.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default EmailServicePage;
