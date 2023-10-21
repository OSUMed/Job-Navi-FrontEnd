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

type Application = {
  rowId: string;
  jobTitle: string;
  dateCreated: string | Date;
  priority: string;
  status: string;
  salary: string;
  location: string;
  notes: string;
  company: string;
  dateApplied: string | Date;
};
const inputConfig = {
  notes: {
    component: "textarea",
  },
  priority: {
    component: "select",
    options: ["High", "Medium", "Low"],
  },
  status: {
    component: "select",
    options: [
      "Bookmarked",
      "Applying",
      "Applied",
      "Interviewing",
      "Negotiating",
      "Accepted",
    ],
  },
};

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

const ApplicationSidebar = ({
  selectedRowData,
  setAllApplications,
  allApplications,
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

  return (
    <div className="max-h-[560px] overflow-y-auto p-2">
      <form onSubmit={handleSidebarSave}>
        <div className="grid gap-4 py-4">
          {Object.entries(selectedRowData || {}).map(([key, value]) => {
            if (key === "rowId") return null;

            const config = inputConfig[key];
            if (config) {
              switch (config.component) {
                case "textarea":
                  return (
                    <div
                      className="grid grid-cols-4 items-center gap-4"
                      key={key}
                    >
                      <Label htmlFor={key} className="text-right">
                        {key}
                      </Label>
                      <textarea
                        id={key}
                        value={formData[key]}
                        onChange={(event) => updateOnChangeSidebar(key, event)}
                        className="col-span-3 resize-none border w-62 h-36"
                      />
                    </div>
                  );
                case "select":
                  return (
                    <div
                      className="grid grid-cols-4 items-center gap-4"
                      key={key}
                    >
                      <Label htmlFor={key} className="text-right">
                        {key}
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          updateOnSelectChangeSidebar(key, value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder={`${selectedRowData[key]}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {config.options.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              onChange={(event) =>
                                updateOnChangeSidebar(key, event)
                              }
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                default:
                  return null;
              }
            } else {
              return (
                <div className="grid grid-cols-4 items-center gap-4" key={key}>
                  <Label htmlFor={key} className="text-right">
                    {key}
                  </Label>
                  <Input
                    id={key}
                    value={formData[key]}
                    onChange={(event) => updateOnChangeSidebar(key, event)}
                    className="col-span-3"
                  />
                </div>
              );
            }
          })}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Update Application</Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </div>
  );
};

export default ApplicationSidebar;
