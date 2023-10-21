import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@/Components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import classnames from "classnames";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
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

export default function ApplicationsForm({ onSubmit, onChange }) {
  const [isEssentialInfoOpen, setIsEssentialInfoOpen] = React.useState(true);
  const [isApplicationTimelineOpen, setIsApplicationTimelineOpen] =
    React.useState(false);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = React.useState(false);
  const [isApplicationNotesOpen, setIsApplicationNotesOpen] =
    React.useState(false);

  const fieldGroups = [
    {
      groupName: "Essential Information",
      fields: [
        {
          label: "Job Title",
          name: "jobTitle",
          type: "text",
          required: true,
          placeholder: "Enter a job name..",
        },
        {
          label: "Company",
          name: "company",
          type: "text",
          required: true,
          placeholder: "Enter a company name..",
        },
        {
          label: "Location",
          name: "location",
          type: "text",
          required: false,
          placeholder: "Enter location..",
        },
        {
          label: "optional",
        },
        {
          label: "Notes",
          name: "notes",
          type: "text",
          placeholder: "Enter notes..",
        },
        {
          label: "Status",
          name: "status",
          type: "text",
          required: false,
          placeholder: "Enter status..",
        },
        {
          label: "Priority",
          name: "priority",
          type: "text",
          placeholder: "Enter priority..",
        },
      ],
    },
    {
      groupName: "Application Timeline",
      fields: [
        {
          label: "Date Applied",
          name: "dateApplied",
          type: "date",
          required: false,
          placeholder: "Enter a date applied..",
        },
        {
          label: "Date Added to List",
          name: "dateCreated",
          type: "date",
          required: false,
          placeholder: "Enter date added..",
        },
      ],
    },
    {
      groupName: "Job Details",
      fields: [
        {
          label: "Salary",
          name: "salary",
          type: "text",
          placeholder: "Enter salary..",
        },
      ],
    },
  ];

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="max-h-[450px] overflow-y-auto p-2">
          {fieldGroups.map((group, idx) => (
            <Collapsible
              key={idx}
              open={
                idx === 0
                  ? isEssentialInfoOpen
                  : idx === 1
                  ? isApplicationTimelineOpen
                  : idx === 2
                  ? isJobDetailsOpen
                  : isApplicationNotesOpen
              }
              onOpenChange={
                idx === 0
                  ? setIsEssentialInfoOpen
                  : idx === 1
                  ? setIsApplicationTimelineOpen
                  : idx === 2
                  ? setIsJobDetailsOpen
                  : setIsApplicationNotesOpen
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
                {group.fields.map((field) => (
                  <div className="text-gray-700 font-medium p-1">
                    {field.label !== "optional" ? (
                      <Label className="text-middle" htmlFor={field.name}>
                        {field.label}:
                      </Label>
                    ) : null}

                    {field.name === "priority" ? (
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {["High", "Medium", "Low"].map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.name === "status" ? (
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Bookmarked",
                            "Applying",
                            "Applied",
                            "Interviewing",
                            "Negotiating",
                            "Accepted",
                          ].map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.label === "optional" ? (
                      <div className="text-gray-500 italic border-b text-xs pb-2 -mb-6">
                        All fields below are optional.
                      </div>
                    ) : field.name === "notes" ? (
                      <Textarea
                        className="col-span-3 resize-none border"
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        onChange={onChange}
                      />
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

        <Button type="submit">Add Application</Button>
      </form>
    </>
  );
}
