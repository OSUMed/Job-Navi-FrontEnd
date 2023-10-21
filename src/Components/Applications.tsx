import * as React from "react";
import Axios from "axios";
import {
  TableContainer,
  Paper,
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  SxProps,
} from "@mui/material";

import { Close as CancelIcon } from "@mui/icons-material";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowId,
  GridRowsProp,
  GridRowModes,
  GridRowModesModel,
  GridToolbar,
  useGridApiRef,
  GridActionsCellItem,
} from "@mui/x-data-grid";
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
import { styled } from "@mui/material/styles";
import { randomId } from "@mui/x-data-grid-generator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
// Reusable Component Imports:
import CustomEditComponent from "./CustomEditComponent";
import ApplicationsForm from "./ApplicationsForm";
import isUpdateForm from "./isUpdateForm";
import { detailedDiff } from "deep-object-diff";
import Header from "./NavBar";
import ContactsForm from "./ContactsForm";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { ToastAction } from "@/Components/ui/toast";
import { useToast } from "@/Components/ui/use-toast";
import { toast } from "@shadcn/ui/toast";
import { Toaster } from "@/Components/ui/toaster";
import AddIcon from "./ui/AddIcon";
import ApplicationSidebar from "./ApplicationSidebar";
// interface PropTypes {
//   cookie: {
//     session: string;
//   };
// }
// const hostURL = "http://localhost:8080/api";
const hostURL = "https://jobtrackerbackend.up.railway.app/api";
// const hostURL =
// "https://cors-anywhere-osu.up.railway.app/https://jobtrackerbackend.up.railway.app/api";
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

// Source: https://stackoverflow.com/questions/70361697/how-to-change-text-color-of-disabled-mui-text-field-mui-v5
const CustomDisabledTextField = styled(TextField)(() => ({
  ".MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#000",
    color: "#000",
  },
}));

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

export default function Applications() {
  const [allApplications, setAllApplications] = React.useState<GridRowsProp>(
    []
  );
  const [confirmData, setConfirmData] = React.useState<any>(null);
  const [addApplication, setaddApplication] = React.useState<any>({
    rowId: "",
    jobTitle: "",
    dateCreated: "",
    priority: "",
    status: "",
    salary: "",
    location: "",
    notes: "",
    company: "",
    dateApplied: "",
  });
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const [open, setOpen] = React.useState(false);

  // const [selectedRowId, setSelectedRowId] = React.useState<Number>(0);
  const { toast } = useToast();
  const [sheetVisible, setSheetVisible] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState<any | null>(
    null
  );

  const [selectedRow, setSelectedRow] = React.useState<string | null>(null);
  const columns: GridColDef[] = [
    {
      field: "jobTitle",
      headerName: "Job Title",
      width: 200,
      editable: true,
      sortable: true,
      renderCell: (params) => (
        <CustomDisabledTextField
          multiline
          variant={"standard"}
          fullWidth
          InputProps={{ disableUnderline: true }}
          maxRows={4}
          disabled={true}
          sx={{
            padding: 1,
            color: "primary.main",
          }}
          defaultValue={params.row.jobTitle}
          value={params.row.jobTitle}
        />
      ),
      renderEditCell: CustomEditComponent,
    },
    {
      field: "company",
      headerName: "Company",
      width: 150,
      editable: true,
      sortable: true,
    },
    // {
    //   field: "dateCreated",
    //   headerName: "Date Created",
    //   hideable: true,
    //   width: 120,
    //   sortable: true,
    // },

    // {
    //   field: "salary",
    //   headerName: "Salary(USD)",
    //   width: 120,
    //   hideable: true,
    //   editable: true,
    //   sortable: true,
    // },
    {
      field: "location",
      headerName: "Job Location",
      width: 150,
      editable: true,
      sortable: true,
      renderCell: (params) => (
        <CustomDisabledTextField
          multiline
          variant={"standard"}
          fullWidth
          InputProps={{ disableUnderline: true }}
          maxRows={4}
          disabled={true}
          sx={{
            padding: 1,
            color: "primary.main",
          }}
          defaultValue={params.row.location}
          value={params.row.location}
        />
      ),
      renderEditCell: CustomEditComponent,
    },
    // {
    //   field: "notes",
    //   headerName: "Notes",
    //   width: 350,
    //   // hide: true,
    //   editable: true,
    //   sortable: true,
    //   resizable: true,
    //   renderCell: (params) => (
    //     <CustomDisabledTextField
    //       multiline
    //       variant={"standard"}
    //       fullWidth
    //       InputProps={{ disableUnderline: true }}
    //       maxRows={4}
    //       disabled={true}
    //       sx={{
    //         padding: 1,
    //         color: "primary.main",
    //       }}
    //       defaultValue={params.row.notes}
    //       value={params.row.notes}
    //     />
    //   ),
    //   // renderCell: (params) => (
    //   //   <CustomDisabledTextField
    //   //     multiline
    //   //     variant={"standard"}
    //   //     fullWidth
    //   //     InputProps={{ disableUnderline: true }}
    //   //     maxRows={4}
    //   //     disabled={true}
    //   //     sx={{
    //   //       padding: 1,
    //   //       color: "primary.main",
    //   //     }}
    //   //     defaultValue={params.row.notes}
    //   //     value={params.row.notes}
    //   //   />
    //   // )
    // },
    {
      field: "dateApplied",
      headerName: "Date Applied",
      width: 100,
      sortable: true,
      // Date Styling addon- Delete if not needed later
      // renderCell: (data) => moment(data).format("YYYY-MM-DD HH:MM:SS"),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
      type: "singleSelect",
      // I want this header's column to have options we can pick from:
      valueOptions: ["High", "Medium", "Low"],
      editable: true,
      sortable: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 155,
      type: "singleSelect",
      // I want this header's column to have options we can pick from:
      valueOptions: [
        "Bookmarked",
        "Applying",
        "Applied",
        "Interviewing",
        "Negotiating",
        "Accepted",
      ],
      editable: true,
      sortable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return (
            <>
              <Button
                className="bg-green-600 hover:bg-green-700 m-4"
                onClick={() => setRowSave(params.row.rowId)}
              >
                Save
              </Button>

              <Button
                className="bg-gray-400 hover:bg-gray-500"
                onClick={() => setRowCancel(params.row.rowId)}
              >
                Cancel
              </Button>
            </>
          );
        }
        return (
          <>
            <Button
              className="m-2"
              onClick={() => setRowEdit(params.row.rowId)}
            >
              Update
            </Button>
            <br />
            <Button
              variant="destructive"
              onClick={() => handleDelete(params.row.rowId)}
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];
  const apiRef = useGridApiRef();
  const dataGridStyles: SxProps = {
    // Required for Data table creation, if data grid doesn't have a height, it errors out(MUI bug):
    height: 500,
  };

  React.useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await Axios.get(`${hostURL}/applications`);
      const transformedApplications = response.data.map(
        (application: Application) => ({
          rowId: application.rowId,
          jobTitle: application.jobTitle,
          dateCreated: application.dateCreated,
          priority: application.priority,
          status: application.status,
          salary: application.salary,
          location: application.location,
          notes: application.notes,
          company: application.company,
          dateApplied: application.dateApplied,
        })
      );
      setAllApplications(transformedApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  /*------------------------------------Create/Add Row Logic------------------------------------*/

  const handleChangeApplication = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setaddApplication((prev: Application) => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const newApplication = {
      applicationId: randomId(),
      jobTitle: addApplication.jobTitle,
      company: addApplication.company,
      location: addApplication.location,
      status: addApplication.status,
      priority: addApplication.priority,
      dateApplied: addApplication.dateApplied,
      dateAdded: addApplication.dateAdded,
      salary: addApplication.salary,
      notes: addApplication.notes,
    };

    let response;
    try {
      response = await Axios.post(`${hostURL}/applications`, newApplication);
      await fetchApplications();
      e.currentTarget.reset();
    } catch (error) {
      console.error("Error adding application:", error);
    }
    if (response && response.status === 200) {
      setOpen(false);
    }
  };

  /*------------------------------------ Change Table Views(not update) ------------------------------------*/

  const setRowEdit = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const setRowSave = async (id: GridRowId) => {
    console.log("what is rowModesModel", rowModesModel);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const setRowCancel = (id: GridRowId) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  /*------------------------------------Confirm Update/Edit Cell Dialog Logic------------------------------------*/

  // Function called to confirm update changes:
  const processRowUpdate = React.useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel) =>
      new Promise<GridRowModel>((resolve, reject) => {
        setConfirmData({ resolve, reject, newRow, oldRow });
      }),
    []
  );

  // Promise resolved based on user dialog response:
  const renderConfirmDialog = () => {
    // Dialog doesn't get rendered if confirmData was never changed:
    if (!confirmData) {
      return null;
    }
    const { newRow, oldRow, resolve } = confirmData;
    const differences = detailedDiff(oldRow, newRow);
    const changedKeys = Object.keys(differences.updated);

    // Case 2: if new input is same as old input, don't show dialog:
    if (JSON.stringify(newRow) === JSON.stringify(oldRow)) {
      resolve(oldRow);
      setConfirmData(null);
      return;
    }

    // Default Case: render confirmation dialog:
    return (
      <>
        {/* <isUpdateForm
          changedKeys={changedKeys}
          confirmData={confirmData}
          handleDataChangeDialog={handleDataChangeDialog}
          differences={differences}
        /> */}
        <Dialog open={confirmData}>
          <DialogTitle>Confirm Update</DialogTitle>
          <DialogContent>
            <DialogTitle>
              You are about to update the following information:
            </DialogTitle>
            {changedKeys.map((key) => (
              <div
                key={key}
                className="bg-gray-100 p-2 border border-gray-300 mb-2"
              >
                <strong>{key}:</strong>{" "}
                {differences.updated[key as keyof typeof differences.updated]}
              </div>
            ))}
            <Typography
              variant="body1"
              gutterBottom
              style={{ marginTop: "1em" }}
            >
              Are you sure you want to proceed?
            </Typography>
            <div className="flex justify-end">
              <Button
                onClick={() => handleDataChangeDialog("No")}
                className="bg-gray-400 hover:bg-gray-500 text-gray-800 mr-2"
              >
                Discard Changes
              </Button>
              <Button
                onClick={() => handleDataChangeDialog("Yes")}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  // User chooses dialog options on editted cell:
  const handleDataChangeDialog = async (response: string) => {
    const { newRow, oldRow, resolve } = confirmData;
    console.log("What is the new row? ", newRow);
    // console.log("New row is: ", newRow, newRow.jobId);
    // If user responds yes, send new row to database, else resolve old row back:
    if (response === "Yes") {
      try {
        const updJob: Application = {
          rowId: newRow.rowId,
          jobTitle: newRow.jobTitle,
          dateCreated: newRow.dateCreated,
          priority: newRow.priority,
          status: newRow.status,
          salary: newRow.salary,
          location: newRow.location,
          notes: newRow.notes,
          company: newRow.company,
          dateApplied: newRow.dateApplied,
        };
        await Axios.post(`${hostURL}/applications/${newRow.rowId}`, updJob);
        resolve(newRow);
        toast({
          description: "Contact Updated!",
        });
        handleSheetOpenChange(false);
      } catch (error) {
        console.error("Error updating Job:", error);
      }
    } else if (response === "No") {
      resolve(oldRow);
    }
    setConfirmData(null);
  };
  // Handles Errors:
  const handleProcessRowUpdateError = (error: Error) => {
    console.log(error);
  };

  /*------------------------------------Delete Row Logic------------------------------------*/

  const handleDelete = async (applicationId: string) => {
    try {
      await Axios.post(`${hostURL}/applications/${applicationId}/delete`);
      await fetchApplications();
      toast({
        description: "Contact deleted!",
      });
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  /*------------------------------------Sidebar Logic------------------------------------*/

  // Only if button is clicked, open sidebar:
  // const handleOpenSheet = () => {
  //   if (selectedRow) {
  //     const rowData = allApplications.find((row) => row.rowId === selectedRow);
  //     setSelectedRowData(rowData);
  //     setSheetVisible(true);
  //   }
  // };

  const handleRowSelection = (event: any) => {
    // setSelectedRowId(event[0]);
    const selectedRowId = event[0];
    console.log("selectedRowId: ", selectedRowId, typeof selectedRowId);
    setSelectedRow(selectedRowId);

    const rowData = allApplications.find((row) => row.rowId === selectedRowId);
    console.log("rowdata: ", rowData, sheetVisible);
    setSelectedRowData(rowData);
  };
  const handleRowDoubleClick = (params: any) => {
    setSelectedRow(params.id);

    const rowData = allApplications.find((row) => row.rowId === params.id);
    console.log("I was double clicked!", rowData);
    setSelectedRowData(rowData);
    setSheetVisible(true);
  };
  const handleSheetOpenChange = (open: boolean) => {
    setSheetVisible(false);
  };
  const handleSidebarSubmit = () => {
    setRowSave(params.row.rowId);
    setSheetVisible(false);
  };

  // const updateOnChangeSidebar = (
  //   key: string,
  //   event: React.ChangeEvent<
  //     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //   >
  // ) => {
  //   const newValue = event.target.value;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [key]: newValue,
  //   }));
  //   console.log("What is here--: ", newValue, formData);
  // };

  //   console.log("formData: ", formData);
  // const handleSidebarSave = async (event) => {
  //   event.preventDefault();

  //   console.log("selectedRowData: ", selectedRowData, typeof selectedRowData);
  //   console.log("selectedRowData: ", formData, typeof formData);
  //   try {
  //     // 1. Update the server--> the promise will make the req
  //     await processRowUpdate(formData, selectedRowData);
  //     // 2. Update the local state
  //     const updatedApplications = allApplications.map((application) =>
  //       application.rowId === formData.rowId ? formData : application
  //     );
  //     setAllApplications(updatedApplications);
  //   } catch (error) {
  //     console.error("Failed to update row:", error);
  //   }
  // };

  return (
    <Box className="bg-gray-100 min-h-screen">
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          sx={{
            p: 2,
          }}
        >
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="mb-2 border bg-white border-purple-500 text-purple-500 hover:bg-purple-100 hover:text-purple-600 px-4 py-2 rounded transition duration-200 ease-in"
                onClick={() => setOpen(true)}
              >
                <AddIcon /> Add Application
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Application</DialogTitle>
                <DialogDescription>
                  Add New Application and Press Enter
                </DialogDescription>
              </DialogHeader>
              <ApplicationsForm
                onSubmit={handleSubmitApplication}
                onChange={handleChangeApplication}
              />
            </DialogContent>
          </Dialog>
          <Sheet open={sheetVisible} onOpenChange={handleSheetOpenChange}>
            <SheetTrigger asChild>
              {sheetVisible && <></>}
              {/* <Button onClick={handleOpenSheet} disabled={!selectedRow}>
              Edit Selected Row
            </Button> */}
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>
              <ApplicationSidebar
                setAllApplications={setAllApplications}
                allApplications={allApplications}
                selectedRowData={selectedRowData}
                // updateOnChangeSidebar={updateOnChangeSidebar}
                // setFormData={setFormData}
                // handleSidebarSave={handleSidebarSave}
                // formData={formData}
                processRowUpdate={processRowUpdate}
                setSelectedRow={setSelectedRow}
              />
            </SheetContent>
          </Sheet>
          <TableContainer component={Paper}>
            <Paper sx={dataGridStyles}>
              {renderConfirmDialog()}
              <DataGrid
                columns={columns}
                rows={allApplications}
                getRowHeight={() => "auto"}
                getRowId={(row) => row.rowId}
                editMode="row"
                rowModesModel={rowModesModel}
                // These 2 props to confirm changes to row:
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                // Toolbar:
                slots={{
                  toolbar: GridToolbar,
                }}
                // Sidebar logic:
                onRowSelectionModelChange={handleRowSelection}
                rowSelectionModel={selectedRow ? [selectedRow] : []}
                onRowDoubleClick={handleRowDoubleClick}
                apiRef={apiRef}
              />
            </Paper>
          </TableContainer>
        </Paper>
      </Container>

      <Toaster />
    </Box>
  );
}
