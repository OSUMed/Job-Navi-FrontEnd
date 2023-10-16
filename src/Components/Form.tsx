import React from "react";
import { TextField, Button } from "@mui/material";

interface FormProps {
  formName: string;
  fields: Array<{
    name: string;
    type: string;
    required?: boolean;
    placeholder: string;
  }>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Form: React.FC<FormProps> = ({
  formName,
  fields,
  onSubmit,
  onChange,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md mx-auto p-4 border border-gray-300 rounded"
    >
      <div className="flex flex-col space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col space-y-2">
            <label htmlFor={field.name} className="font-bold text-base">
              {field.label}
            </label>
            <TextField
              type={field.type}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              onChange={onChange}
              variant="outlined"
              className="w-full max-w-lg text-sm"
            />
          </div>
        ))}
      </div>
      <div className="mt-5">
        <Button type="submit" variant="contained" color="primary">
          {formName}
        </Button>
      </div>
    </form>
  );
};

export default Form;
