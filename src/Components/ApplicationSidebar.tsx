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
import { Button } from "./ui/button";

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
  updatedRowData,
  processRowUpdate,
  setSelectedRow,
}) => {
  const [formData, setFormData] = React.useState({ ...selectedRowData });

  const updateSidebar = (
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

  //   console.log("formData: ", formData);
  const handleSidebarSave = async (event) => {
    event.preventDefault();

    console.log("selectedRowData: ", selectedRowData, typeof selectedRowData);
    console.log("selectedRowData: ", formData, typeof formData);
    try {
      // 1. Update the server--> the promise will make the req
      await processRowUpdate(formData, selectedRowData);
      // 2. Update the local state
      const updatedApplications = allApplications.map((application) =>
        application.rowId === formData.rowId ? formData : application
      );
      setAllApplications(updatedApplications);
      // Optionally: Show a success message to the user
    } catch (error) {
      console.error("Failed to update row:", error);
    }
  };

  return (
    <div className="max-h-[450px] overflow-y-auto p-2">
      <div className="grid gap-4 py-4">
        <form onSubmit={handleSidebarSave}>
          {Object.entries(selectedRowData || {}).map(([key, value]) => {
            if (key === "rowid") return null;
            else {
              return (
                <div className="grid grid-cols-4 items-center gap-4" key={key}>
                  <Label htmlFor={key} className="text-right">
                    {key}
                  </Label>
                  <Input
                    id={key}
                    value={formData[key]}
                    onChange={(event) => updateSidebar(key, event)}
                    className="col-span-3"
                  />
                </div>
              );
            }
          })}
          <Button type="submit">Update Application</Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="max-h-[450px] overflow-y-auto p-2">
      <div className="grid gap-4 py-4">
        {Object.entries(selectedRowData || {}).map(([key, value]) => {
          if (key === "rowid") return null;

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
                      className="col-span-3"
                      value={formData[key]}
                      onChange={updateSidebar(key)}
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
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={`Select ${key}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {config.options.map((option) => (
                          <SelectItem
                            key={option}
                            value={formData[key]}
                            onChange={updateSidebar(key)}
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
                  onChange={updateSidebar(key)}
                  className="col-span-3"
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default ApplicationSidebar;
