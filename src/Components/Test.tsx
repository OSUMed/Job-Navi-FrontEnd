import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";

export default function SingleRowSelectionGrid() {
  const { data } = useDemoData({
    dataSet: "Commodity",
    rowLength: 10,
    maxColumns: 6,
  });

  const [selectedRow, setSelectedRow] = React.useState<string | null>(null);

  const handleRowSelection = (event: any) => {
    const selectedRowId = event[0];
    console.log(selectedRowId);
    setSelectedRow(selectedRowId);
    // Do whatever you want with the selected row ID

    // Find the row data using the selectedRowId
    const selectedRowData = data.rows.find((row) => row.id === selectedRowId);
    console.log(selectedRowData);
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        {...data}
        onRowSelectionModelChange={handleRowSelection}
        rowSelectionModel={selectedRow ? [selectedRow] : []}
      />
    </div>
  );
}
