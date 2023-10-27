import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";

interface Contact {
  rowId: string;
  companyName?: string;
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  relationship?: string;
  notes?: string;
  followUpDate?: string | Date;
}

type FormData = {
  rowId: string;
  notes: string;
  priority: string;
  status: string;
  jobTitle: string;
  company: string;
  location: string;
  dateApplied: Date | string;
  dateCreated: Date | string;
  salary: string;
};

const inputConfig = {
  companyName: {
    component: "input",
    type: "text",
    placeholder: "Enter company name..",
    required: true,
    label: "Company Name",
    order: 1,
  },
  fullName: {
    component: "input",
    type: "text",
    placeholder: "Enter full name..",
    required: true,
    label: "Full Name",
    order: 2,
  },
  title: {
    component: "input",
    type: "text",
    placeholder: "Enter title..",
    label: "Title",
    order: 3,
  },
  email: {
    component: "input",
    type: "text",
    placeholder: "Enter email..",
    required: true,
    label: "Email",
    order: 4,
  },
  phone: {
    component: "input",
    type: "text",
    placeholder: "Enter phone..",
    required: true,
    label: "Phone",
    order: 5,
  },
  relationship: {
    component: "input",
    type: "text",
    placeholder: "Enter relationship..",
    required: true,
    label: "Relationship",
    order: 6,
  },
  notes: {
    component: "input",
    type: "text",
    placeholder: "Enter notes..",
    required: true,
    label: "Notes",
    order: 7,
  },
  followUpDate: {
    component: "input",
    type: "date",
    placeholder: "Enter follow-up date..",
    required: true,
    label: "Follow Up Date",
    order: 8,
  },
};

const ContactsSidebar = ({
  selectedRowData,
  setAllContacts,
  allContacts,
  processRowUpdate,
}) => {
  const [formData, setFormData] = React.useState<FormData>({
    ...selectedRowData,
  });

  const updateOnChangeSidebar = (
    key: string,
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const newValue = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [key]: newValue,
    }));
  };

  const updateOnSelectChangeSidebar = (key: string, selectedValue: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: selectedValue,
    }));
  };

  const handleSidebarSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // 1. Update the server--> the promise will make the req
      await processRowUpdate(formData, selectedRowData);

      // 2. Update the local state
      const updatedApplications = allApplications.map(
        (application: Application) =>
          application.rowId === formData.rowId ? formData : application
      );
      setAllApplications(updatedApplications);
    } catch (error) {
      console.error("Failed to update row:", error);
    }
  };

  const sortedFields = Object.entries(selectedRowData || {})
    .filter(([key]) => key !== "rowId")
    .sort(
      ([keyA], [keyB]) => inputConfig[keyA].order - inputConfig[keyB].order
    );

  return (
    <div className="max-h-[560px] overflow-y-auto p-2">
      <form onSubmit={handleSidebarSave}>
        <div className="grid gap-4 py-4">
          {sortedFields.map(([key, value]) => {
            const config = inputConfig[key];
            switch (config.component) {
              case "textarea":
                return (
                  <div
                    className="grid grid-cols-4 items-center gap-4"
                    key={key}
                  >
                    <Label htmlFor={key} className="text-right">
                      {config.label}
                    </Label>
                    <textarea
                      id={key}
                      value={formData[key]}
                      onChange={(event) => updateOnChangeSidebar(key, event)}
                      className="col-span-3 resize-none border w-62 h-36"
                    />
                  </div>
                );
              case "input":
                return (
                  <div
                    className="grid grid-cols-4 items-center gap-4"
                    key={key}
                  >
                    <Label htmlFor={key} className="text-right">
                      {config.label}
                    </Label>
                    <Input
                      id={key}
                      type={config.type}
                      placeholder={config.placeholder}
                      value={formData[key]}
                      onChange={(event) => updateOnChangeSidebar(key, event)}
                      className="col-span-3"
                    />
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Update Contact</Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </div>
  );
};

export default ContactsSidebar;
