import React from "react";
import { TextField } from "@mui/material";
import {
  useGridApiContext,
  GridRenderEditCellParams,
  GridColDef,
} from "@mui/x-data-grid";

const CustomEditComponent: GridColDef["renderCell"] = (
  params: GridRenderEditCellParams
) => {
  const { id, field, formattedValue } = params;
  const apiRef = useGridApiContext();

  return (
    <TextField
      multiline
      variant="standard"
      fullWidth
      InputProps={{ disableUnderline: true }}
      maxRows={4}
      disabled={false}
      sx={{
        padding: 1,
        color: "primary.main",
      }}
      onChange={(e) => {
        apiRef.current.setEditCellValue({ id, field, value: e.target.value });
        params.value = e.target.value;
      }}
      defaultValue={formattedValue}
    />
  );
};

export default CustomEditComponent;
