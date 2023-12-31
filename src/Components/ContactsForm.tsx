import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@/Components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

import Axios from "axios";
import { randomId } from "@mui/x-data-grid-generator";
// import Axios from "axios";
// const hostURL = "http://localhost:8080";
// const hostURL = "https://jobtrackerbackend.up.railway.app/";
const hostURL =
  "https://cors-anywhere-osu.up.railway.app/https://jobtrackerbackend.up.railway.app/api";

export default function ContactsForm({
  onSubmit,
  onChange,
  setOpen,
  addContact,
  fetchContacts,
}) {
  const [isCompanyInfoOpen, setIsCompanyInfoOpen] = React.useState(true);
  const [isContactDetailsOpen, setIsContactDetailsOpen] = React.useState(false);
  const [isAdditionalNotesOpen, setIsAdditionalNotesOpen] =
    React.useState(false);

  // const handleCloseNow = () => {
  //   setOpen(false);
  // };
  const handleCloseNow = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("new contact is: ", addContact);
    const newContact = {
      contactId: randomId(),
      companyName: addContact.companyName,
      fullName: addContact.fullName,
      title: addContact.title,
      email: addContact.email,
      phone: addContact.phone,
      relationship: addContact.relationship,
      notes: addContact.notes,
      followUpDate: addContact.followUpDate,
    };

    let response;
    try {
      response = await Axios.post(`${hostURL}/contacts`, newContact);
      await fetchContacts();
      e.currentTarget.reset();
    } catch (error) {
      console.error("Error adding contact:", error);
    }
    if (response && response.status === 200) {
      setOpen(false);
    }
  };
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

          required: true,
          placeholder: "Enter title..",
        },
        {
          label: "optional",
        },
        {
          label: "Relationship",
          name: "relationship",
          type: "text",
          required: false,
          placeholder: "Enter relationship..",
        },
        {
          label: "Notes",
          name: "notes",
          type: "text",
          placeholder: "Enter notes..",
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

          required: false,
          placeholder: "Enter email..",
        },
        {
          label: "Phone",
          name: "phone",
          type: "text",
          required: false,
          placeholder: "Enter phone..",
        },
      ],
    },
    {
      groupName: "Additional Notes",
      fields: [
        {
          label: "Follow Up Date",
          name: "followUpDate",
          type: "date",
          required: false,
          placeholder: "Enter follow-up date..",
        },
      ],
    },
  ];

  return (
    <>
      <form onSubmit={handleCloseNow}>
        <div className="max-h-[450px] overflow-y-auto">
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
              <div className="flex items-center justify-start border-b-2 border-black-900 p-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {group.groupName}
                </h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <CaretSortIcon className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="space-y-1">
                {group.fields.map((field, fieldIdx) => (
                  <div
                    className="text-gray-700 font-medium p-1"
                    htmlFor={field.name}
                  >
                    {field.label !== "optional" ? (
                      <Label className="text-middle" htmlFor={field.name}>
                        {field.label}:
                      </Label>
                    ) : null}
                    {field.label === "optional" ? (
                      <div className="text-gray-500 italic border-b text-xs pb-2 -mb-6">
                        All fields below are optional.
                      </div>
                    ) : (
                      <Input
                        className="col-span-3"
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        onChange={onChange}
                      />
                    )}
                    <br />
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
          <br />
          <br />
        </div>

        <Button type="submit">Add Contact</Button>

        {/* <Button onClick={handleCloseNow}>Close Add Contact Dialog</Button> */}
      </form>
    </>
  );
}
