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
    <form onSubmit={onSubmit}>
      {fields.map((field) => (
        <TextField
          key={field.name}
          type={field.type}
          name={field.name}
          required={field.required}
          placeholder={field.placeholder}
          onChange={onChange}
          variant="outlined"
          style={{ width: "200px", margin: "5px" }}
        />
      ))}
      <br />
      <Button type="submit" variant="contained" color="primary">
        {formName}
      </Button>
    </form>
  );
};

export default Form;
