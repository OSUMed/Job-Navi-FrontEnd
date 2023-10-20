import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import Test3 from "./Test3";

export default function SingleRowSelectionGrid2() {
  const { data } = useDemoData({
    dataSet: "Commodity",
    rowLength: 10,
    maxColumns: 6,
  });

  const [sheetVisible, setSheetVisible] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState<any | null>(
    null
  );
  const [selectedRow, setSelectedRow] = React.useState<string | null>(null);
  const handleOpenSheet = () => {
    if (selectedRow) {
      const rowData = data.rows.find((row) => row.id === selectedRow);
      setSelectedRowData(rowData);
      setSheetVisible(true);
    }
  };
  const handleRowSelection = (event: any) => {
    const selectedRowId = event[0];
    setSelectedRow(selectedRowId);

    const rowData = data.rows.find((row) => row.id === selectedRowId);
    console.log("rowdata: ", rowData, sheetVisible);
    setSelectedRowData(rowData);
    // setSheetVisible(true);
  };
  const handleRowDoubleClick = (params: any) => {
    setSelectedRow(params.id);

    const rowData = data.rows.find((row) => row.id === params.id);
    console.log("I was double clicked!", rowData);
    setSelectedRowData(rowData);
    setSheetVisible(true);
  };
  const handleSheetOpenChange = (open: boolean) => {
    setSheetVisible(open);
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Sheet open={sheetVisible} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          {sheetVisible ? <></> : <h1>Hello fail</h1>}
          {/* <Button onClick={handleOpenSheet} disabled={!selectedRow}>
              Edit Selected Row
            </Button> */}
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {Object.entries(selectedRowData || {}).map(([key, value]) => (
              <div className="grid grid-cols-4 items-center gap-4" key={key}>
                <Label htmlFor={key} className="text-right">
                  {key}
                </Label>
                <Input id={key} value={value} className="col-span-3" />
              </div>
            ))}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={() => setSheetVisible(false)}>
                Save changes
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <DataGrid
        {...data}
        onRowSelectionModelChange={handleRowSelection}
        rowSelectionModel={selectedRow ? [selectedRow] : []}
        onRowDoubleClick={handleRowDoubleClick}
      />
    </div>
  );
}
