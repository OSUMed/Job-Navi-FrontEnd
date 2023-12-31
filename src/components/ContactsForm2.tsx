"use client";

import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function ContactsForm({ onSubmit, onChange }) {
  const [isCompanyInfoOpen, setIsCompanyInfoOpen] = React.useState(false);
  const [isContactDetailsOpen, setIsContactDetailsOpen] = React.useState(false);
  const [isAdditionalNotesOpen, setIsAdditionalNotesOpen] =
    React.useState(false);

  const fieldGroups = [
    {
      groupName: "Company Information",
      fields: [
        {
          label: "Company Name",
          name: "companyName",
          type: "text",
          required: true,
          placeholder: "Enter company name..",
        },
        {
          label: "Full Name",
          name: "fullName",
          type: "text",
          required: true,
          placeholder: "Enter full name..",
        },
        {
          label: "Title",
          name: "title",
          type: "text",
          placeholder: "Enter title..",
        },
        {
          label: "Relationship",
          name: "relationship",
          type: "text",
          required: true,
          placeholder: "Enter relationship..",
        },
      ],
    },
    {
      groupName: "Contact Details",
      fields: [
        {
          label: "Email",
          name: "email",
          type: "text",
          required: true,
          placeholder: "Enter email..",
        },
        {
          label: "Phone",
          name: "phone",
          type: "text",
          required: true,
          placeholder: "Enter phone..",
        },
      ],
    },
    {
      groupName: "Additional Notes",
      fields: [
        {
          label: "Notes",
          name: "notes",
          type: "text",
          required: true,
          placeholder: "Enter notes..",
        },
        {
          label: "Follow Up Date",
          name: "followUpDate",
          type: "date",
          required: true,
          placeholder: "Enter follow-up date..",
        },
      ],
    },
  ];

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <form
        onSubmit={onSubmit}
        className="max-w-md mx-auto p-4 border border-gray-300 rounded"
      >
        {fieldGroups.map((group, idx) => (
          <Collapsible
            key={idx}
            open={
              idx === 0
                ? isCompanyInfoOpen
                : idx === 1
                ? isContactDetailsOpen
                : isAdditionalNotesOpen
            }
            onOpenChange={
              idx === 0
                ? setIsCompanyInfoOpen
                : idx === 1
                ? setIsContactDetailsOpen
                : setIsAdditionalNotesOpen
            }
            className="w-[350px] space-y-2"
          >
            <div className="flex items-center justify-between space-x-4 px-4">
              <h4 className="text-sm font-semibold">{group.groupName}</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <CaretSortIcon className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              {group.fields.map((field, fieldIdx) => (
                <div
                  key={fieldIdx}
                  className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm"
                >
                  {field.label}:{" "}
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={onChange}
                    variant="outlined"
                    className="w-full max-w-lg text-sm"
                  />
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </form>
    </>
  );
}
