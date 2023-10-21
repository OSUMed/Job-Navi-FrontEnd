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
  dateApplied: Date | string; // Can be a Date or a string
  dateCreated: Date | string; // Can be a Date or a string
  salary: string;
};

const ApplicationSidebar = ({ selectedRowData }) => {
  const [formData, setFormData] = React.useState<FormData>({
    notes: "",
    priority: "",
    status: "",
    jobTitle: "",
    company: "",
    location: "",
    dateApplied: "",
    dateCreated: "",
    salary: "",
  });

  const updateSidebar =
    (key: string) =>
    (
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

  const handleSidebarSave = async (
    setAllApplications,
    allApplications,
    updatedRowData,
    processRowUpdate
  ) => {
    try {
      // 1. Update the server
      await processRowUpdate(
        updatedRowData,
        getOldRowData(updatedRowData.rowId)
      );
      await updateServer();

      // 2. Update the local state
      const updatedApplications = allApplications.map((application) =>
        application.rowId === updatedRowData.rowId
          ? updatedRowData
          : application
      );
      setAllApplications(updatedApplications);

      // Optionally: Show a success message to the user
    } catch (error) {
      console.error("Failed to update row:", error);
      // Handle error, possibly reverting the UI change or showing an error message
    }
  };
  // This function would retrieve the old data for a given row ID
  const getOldRowData = (rowId) => {
    return allApplications.find((application) => application.rowId === rowId);
  };

  return (
    <div className="max-h-[450px] overflow-y-auto p-2">
      <div className="grid gap-4 py-4">
        {Object.entries(selectedRowData || {}).map(([key, value]) => {
          if (key === "id") return null;

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
