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
    const selectedRowId = event[0];
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
    setSheetVisible(open);
  };
  const handleSidebarSubmit = () => {
    setRowSave(params.row.rowId);
    setSheetVisible(false);
  };

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
                processRowUpdate={processRowUpdate}
              />
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" onClick={handleSidebarSubmit}>
                    {/* <Button type="submit" onClick={() => setSheetVisible(false)}> */}
                    Save changes
                  </Button>
                </SheetClose>
              </SheetFooter>
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

// https://mockaroo.com/
// const tableData: GridRowsProp = [
//   {
//     jobId: 1,
//     jobTitle: "Electrical Engineer",
//     dateCreated: "4/22/2022",
//     priority: 4,
//     status: "Interviewing",
//     salary: "$211128.25",
//     location: "881 Milwaukee Street",
//     notes: "phasellus in felis donec semper sapien a libero nam dui",
//     company: "Twitterbridge",
//     dateApplied: "8/23/2022",
//   },
//   {
//     jobId: 2,
//     jobTitle: "Analog Circuit Design manager",
//     dateCreated: "1/11/2023",
//     priority: 4,
//     status: "Accepted",
//     salary: "$102198.34",
//     location: "2 Rowland Court",
//     notes:
//       "morbi sem mauris laoreet ut rhoncus aliquet pulvinar sed nisl nunc rhoncus dui vel sem sed",
//     company: "Bluezoom",
//     dateApplied: "8/3/2022",
//   },
//   {
//     jobId: 3,
//     jobTitle: "Data Coordiator",
//     dateCreated: "10/30/2022",
//     priority: 3,
//     status: "Accepted",
//     salary: "$109692.37",
//     location: "68150 Paget Circle",
//     notes:
//       "nulla eget eros elementum pellentesque quisque porta volutpat erat quisque erat eros viverra eget congue eget",
//     company: "Feednation",
//     dateApplied: "5/1/2022",
//   },
//   {
//     jobId: 4,
//     jobTitle: "Computer Systems Analyst IV",
//     dateCreated: "10/17/2022",
//     priority: 2,
//     status: "Bookmarked",
//     salary: "$283168.91",
//     location: "657 Old Shore Place",
//     notes:
//       "in faucibus orci luctus et ultrices posuere cubilia curae duis faucibus accumsan odio curabitur convallis",
//     company: "Voolith",
//     dateApplied: "7/7/2022",
//   },
//   {
//     jobId: 5,
//     jobTitle: "Nurse",
//     dateCreated: "2/17/2022",
//     priority: 2,
//     status: "Applied",
//     salary: "$86302.25",
//     location: "4 Mayfield Circle",
//     notes: "sem fusce consequat nulla nisl nunc nisl duis bibendum felis sed",
//     company: "Geba",
//     dateApplied: "10/11/2022",
//   },
//   {
//     jobId: 6,
//     jobTitle: "Junior Executive",
//     dateCreated: "2/4/2022",
//     priority: 5,
//     status: "Applied",
//     salary: "$153576.48",
//     location: "63 Hintze Lane",
//     notes:
//       "lorem integer tincidunt ante vel ipsum praesent blandit lacinia erat vestibulum sed magna at nunc commodo placerat praesent",
//     company: "Brainverse",
//     dateApplied: "12/12/2022",
//   },
//   {
//     jobId: 7,
//     jobTitle: "Safety Technician II",
//     dateCreated: "11/1/2022",
//     priority: 4,
//     status: "Applying",
//     salary: "$103520.00",
//     location: "539 Beilfuss Drive",
//     notes:
//       "curabitur gravida nisi at nibh in hac habitasse platea dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum",
//     company: "Meedoo",
//     dateApplied: "7/27/2022",
//   },
//   {
//     jobId: 8,
//     jobTitle: "Food Chemist",
//     dateCreated: "7/12/2022",
//     priority: 2,
//     status: "Negotiating",
//     salary: "$93458.86",
//     location: "59085 Calypso Circle",
//     notes:
//       "mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa id",
//     company: "Trudeo",
//     dateApplied: "7/1/2022",
//   },
//   {
//     jobId: 9,
//     jobTitle: "Senior Editor",
//     dateCreated: "3/8/2022",
//     priority: 2,
//     status: "Interviewing",
//     salary: "$78292.13",
//     location: "55 Vermont Plaza",
//     notes:
//       "platea dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum at lorem integer",
//     company: "Dynabox",
//     dateApplied: "1/3/2023",
//   },
//   {
//     jobId: 10,
//     jobTitle: "Cost Accountant",
//     dateCreated: "6/25/2022",
//     priority: 1,
//     status: "Applying",
//     salary: "$249158.87",
//     location: "1 Gulseth Hill",
//     notes:
//       "quam a odio in hac habitasse platea dictumst maecenas ut massa quis augue luctus tincidunt nulla mollis",
//     company: "Demimbu",
//     dateApplied: "5/24/2022",
//   },
//   {
//     jobId: 11,
//     jobTitle: "Analog Circuit Design manager",
//     dateCreated: "9/30/2022",
//     priority: 1,
//     status: "Applying",
//     salary: "$105574.26",
//     location: "18266 Bay Park",
//     notes:
//       "erat volutpat in congue etiam justo etiam pretium iaculis justo in hac habitasse platea dictumst etiam faucibus cursus",
//     company: "Eimbee",
//     dateApplied: "8/21/2022",
//   },
//   {
//     jobId: 12,
//     jobTitle: "Nuclear Power Engineer",
//     dateCreated: "7/29/2022",
//     priority: 1,
//     status: "Accepted",
//     salary: "$78067.78",
//     location: "710 Buena Vista Street",
//     notes:
//       "malesuada in imperdiet et commodo vulputate justo in blandit ultrices enim lorem ipsum dolor sit",
//     company: "Flashspan",
//     dateApplied: "9/4/2022",
//   },
//   {
//     jobId: 13,
//     jobTitle: "Actuary",
//     dateCreated: "9/4/2022",
//     priority: 3,
//     status: "Applied",
//     salary: "$92173.87",
//     location: "48 Bluejay Center",
//     notes:
//       "molestie lorem quisque ut erat curabitur gravida nisi at nibh in hac",
//     company: "Digitube",
//     dateApplied: "6/2/2022",
//   },
//   {
//     jobId: 14,
//     jobTitle: "Physical Therapy Assistant",
//     dateCreated: "7/20/2022",
//     priority: 4,
//     status: "Negotiating",
//     salary: "$276896.18",
//     location: "24824 Knutson Alley",
//     notes:
//       "duis aliquam convallis nunc proin at turpis a pede posuere nonummy integer non",
//     company: "Meejo",
//     dateApplied: "8/24/2022",
//   },
//   {
//     jobId: 15,
//     jobTitle: "Media Manager IV",
//     dateCreated: "3/30/2022",
//     priority: 3,
//     status: "Negotiating",
//     salary: "$277948.10",
//     location: "236 Ramsey Plaza",
//     notes:
//       "amet cursus id turpis integer aliquet massa id lobortis convallis tortor risus dapibus augue vel accumsan tellus nisi eu orci",
//     company: "Kare",
//     dateApplied: "2/27/2022",
//   },
//   {
//     jobId: 16,
//     jobTitle: "Senior Developer",
//     dateCreated: "5/20/2022",
//     priority: 1,
//     status: "Accepted",
//     salary: "$294057.06",
//     location: "81255 Hanson Road",
//     notes:
//       "mi integer ac neque duis bibendum morbi non quam nec dui luctus rutrum",
//     company: "Jaxnation",
//     dateApplied: "10/21/2022",
//   },
//   {
//     jobId: 17,
//     jobTitle: "Human Resources Manager",
//     dateCreated: "11/18/2022",
//     priority: 1,
//     status: "Bookmarked",
//     salary: "$84284.63",
//     location: "563 Shasta Court",
//     notes:
//       "vestibulum eget vulputate ut ultrices vel augue vestibulum ante ipsum primis in faucibus",
//     company: "Riffwire",
//     dateApplied: "11/8/2022",
//   },
//   {
//     jobId: 18,
//     jobTitle: "Environmental Tech",
//     dateCreated: "3/4/2022",
//     priority: 5,
//     status: "Applying",
//     salary: "$71020.55",
//     location: "72270 Delaware Crossing",
//     notes:
//       "donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin mi sit amet lobortis sapien sapien non mi",
//     company: "Skidoo",
//     dateApplied: "11/9/2022",
//   },
//   {
//     jobId: 19,
//     jobTitle: "Junior Executive",
//     dateCreated: "1/10/2023",
//     priority: 3,
//     status: "Accepted",
//     salary: "$198800.20",
//     location: "554 Crescent Oaks Parkway",
//     notes: "pellentesque at nulla suspendisse potenti cras in purus eu magna",
//     company: "Fanoodle",
//     dateApplied: "3/24/2022",
//   },
//   {
//     jobId: 20,
//     jobTitle: "Help Desk Technician",
//     dateCreated: "6/9/2022",
//     priority: 4,
//     status: "Applying",
//     salary: "$225549.60",
//     location: "8 Lakewood Gardens Hill",
//     notes:
//       "donec diam neque vestibulum eget vulputate ut ultrices vel augue vestibulum ante ipsum primis in faucibus orci luctus et ultrices",
//     company: "Demizz",
//     dateApplied: "6/25/2022",
//   },
//   {
//     jobId: 21,
//     jobTitle: "Accounting Assistant I",
//     dateCreated: "5/21/2022",
//     priority: 2,
//     status: "Interviewing",
//     salary: "$118334.83",
//     location: "7 Wayridge Hill",
//     notes:
//       "sagittis nam congue risus semper porta volutpat quam pede lobortis ligula sit amet eleifend pede",
//     company: "Rhyzio",
//     dateApplied: "12/6/2022",
//   },
//   {
//     jobId: 22,
//     jobTitle: "Geologist II",
//     dateCreated: "7/14/2022",
//     priority: 3,
//     status: "Negotiating",
//     salary: "$72982.61",
//     location: "9 Pawling Point",
//     notes:
//       "curae mauris viverra diam vitae quam suspendisse potenti nullam porttitor",
//     company: "Meetz",
//     dateApplied: "5/20/2022",
//   },
//   {
//     jobId: 23,
//     jobTitle: "Physical Therapy Assistant",
//     dateCreated: "11/18/2022",
//     priority: 4,
//     status: "Applying",
//     salary: "$284391.47",
//     location: "46168 Brown Court",
//     notes:
//       "felis donec semper sapien a libero nam dui proin leo odio porttitor id consequat",
//     company: "Shufflester",
//     dateApplied: "4/2/2022",
//   },
//   {
//     jobId: 24,
//     jobTitle: "Graphic Designer",
//     dateCreated: "12/1/2022",
//     priority: 4,
//     status: "Applied",
//     salary: "$287686.64",
//     location: "91671 Kim Drive",
//     notes: "eu massa donec dapibus duis at velit eu est congue elementum in",
//     company: "Shufflebeat",
//     dateApplied: "3/8/2022",
//   },
//   {
//     jobId: 25,
//     jobTitle: "Developer IV",
//     dateCreated: "11/3/2022",
//     priority: 5,
//     status: "Interviewing",
//     salary: "$115161.59",
//     location: "44 Sommers Junction",
//     notes:
//       "a libero nam dui proin leo odio porttitor id consequat in consequat ut nulla",
//     company: "Kanoodle",
//     dateApplied: "9/25/2022",
//   },
//   {
//     jobId: 26,
//     jobTitle: "Environmental Tech",
//     dateCreated: "7/26/2022",
//     priority: 1,
//     status: "Negotiating",
//     salary: "$173022.46",
//     location: "940 Fisk Terrace",
//     notes:
//       "arcu adipiscing molestie hendrerit at vulputate vitae nisl aenean lectus pellentesque eget nunc donec quis orci eget orci vehicula",
//     company: "Thoughtworks",
//     dateApplied: "4/16/2022",
//   },
//   {
//     jobId: 27,
//     jobTitle: "Civil Engineer",
//     dateCreated: "12/9/2022",
//     priority: 5,
//     status: "Applying",
//     salary: "$203643.71",
//     location: "11651 Hoard Court",
//     notes:
//       "nascetur ridiculus mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa id nisl venenatis",
//     company: "Linktype",
//     dateApplied: "5/7/2022",
//   },
//   {
//     jobId: 28,
//     jobTitle: "Accounting Assistant III",
//     dateCreated: "12/30/2022",
//     priority: 1,
//     status: "Interviewing",
//     salary: "$294869.24",
//     location: "411 Raven Terrace",
//     notes:
//       "nunc commodo placerat praesent blandit nam nulla integer pede justo lacinia eget tincidunt eget tempus vel pede morbi porttitor",
//     company: "Katz",
//     dateApplied: "2/1/2023",
//   },
//   {
//     jobId: 29,
//     jobTitle: "Assistant Manager",
//     dateCreated: "4/5/2022",
//     priority: 3,
//     status: "Applied",
//     salary: "$133097.41",
//     location: "090 Stone Corner Street",
//     notes:
//       "donec diam neque vestibulum eget vulputate ut ultrices vel augue vestibulum ante ipsum primis",
//     company: "Realblab",
//     dateApplied: "6/26/2022",
//   },
//   {
//     jobId: 30,
//     jobTitle: "Librarian",
//     dateCreated: "6/27/2022",
//     priority: 1,
//     status: "Interviewing",
//     salary: "$269585.56",
//     location: "7458 Sherman Circle",
//     notes:
//       "odio justo sollicitudin ut suscipit a feugiat et eros vestibulum ac est lacinia nisi venenatis tristique",
//     company: "Divanoodle",
//     dateApplied: "7/7/2022",
//   },
//   {
//     jobId: 31,
//     jobTitle: "Operator",
//     dateCreated: "11/29/2022",
//     priority: 2,
//     status: "Bookmarked",
//     salary: "$127959.28",
//     location: "14 Dayton Way",
//     notes:
//       "turpis elementum ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus",
//     company: "Gigaclub",
//     dateApplied: "10/24/2022",
//   },
//   {
//     jobId: 32,
//     jobTitle: "Desktop Support Technician",
//     dateCreated: "7/29/2022",
//     priority: 4,
//     status: "Interviewing",
//     salary: "$165717.69",
//     location: "27827 American Pass",
//     notes:
//       "aliquam augue quam sollicitudin vitae consectetuer eget rutrum at lorem integer tincidunt",
//     company: "Skidoo",
//     dateApplied: "4/30/2022",
//   },
//   {
//     jobId: 33,
//     jobTitle: "Accountant III",
//     dateCreated: "10/3/2022",
//     priority: 1,
//     status: "Interviewing",
//     salary: "$263698.54",
//     location: "22755 Birchwood Place",
//     notes:
//       "ut erat curabitur gravida nisi at nibh in hac habitasse platea dictumst aliquam augue quam",
//     company: "Gigaclub",
//     dateApplied: "11/14/2022",
//   },
//   {
//     jobId: 34,
//     jobTitle: "Teacher",
//     dateCreated: "9/24/2022",
//     priority: 3,
//     status: "Negotiating",
//     salary: "$232981.73",
//     location: "795 Butterfield Hill",
//     notes:
//       "id lobortis convallis tortor risus dapibus augue vel accumsan tellus nisi",
//     company: "Fivechat",
//     dateApplied: "10/25/2022",
//   },
//   {
//     jobId: 35,
//     jobTitle: "Sales Representative",
//     dateCreated: "10/2/2022",
//     priority: 5,
//     status: "Negotiating",
//     salary: "$233525.60",
//     location: "70 Daystar Terrace",
//     notes:
//       "in sagittis dui vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non",
//     company: "Mymm",
//     dateApplied: "5/15/2022",
//   },
//   {
//     jobId: 36,
//     jobTitle: "Information Systems Manager",
//     dateCreated: "2/24/2022",
//     priority: 5,
//     status: "Negotiating",
//     salary: "$195320.40",
//     location: "93 Katie Crossing",
//     notes:
//       "curae nulla dapibus dolor vel est donec odio justo sollicitudin ut suscipit a",
//     company: "Voomm",
//     dateApplied: "1/27/2023",
//   },
//   {
//     jobId: 37,
//     jobTitle: "Systems Administrator II",
//     dateCreated: "8/29/2022",
//     priority: 5,
//     status: "Applying",
//     salary: "$199668.85",
//     location: "835 Vahlen Circle",
//     notes:
//       "pretium nisl ut volutpat sapien arcu sed augue aliquam erat volutpat in congue etiam justo etiam pretium iaculis",
//     company: "Lazz",
//     dateApplied: "4/15/2022",
//   },
//   {
//     jobId: 38,
//     jobTitle: "Financial Advisor",
//     dateCreated: "3/26/2022",
//     priority: 5,
//     status: "Bookmarked",
//     salary: "$81032.82",
//     location: "1385 Clove Plaza",
//     notes:
//       "sodales scelerisque mauris sit amet eros suspendisse accumsan tortor quis turpis",
//     company: "Ntag",
//     dateApplied: "9/4/2022",
//   },
//   {
//     jobId: 39,
//     jobTitle: "GIS Technical Architect",
//     dateCreated: "8/10/2022",
//     priority: 3,
//     status: "Bookmarked",
//     salary: "$235754.54",
//     location: "45 Alpine Junction",
//     notes:
//       "est risus auctor sed tristique in tempus sit amet sem fusce consequat nulla",
//     company: "Digitube",
//     dateApplied: "6/21/2022",
//   },
//   {
//     jobId: 40,
//     jobTitle: "Business Systems Development Analyst",
//     dateCreated: "8/12/2022",
//     priority: 5,
//     status: "Accepted",
//     salary: "$276058.72",
//     location: "02 Hollow Ridge Avenue",
//     notes:
//       "in quam fringilla rhoncus mauris enim leo rhoncus sed vestibulum sit amet",
//     company: "Realmix",
//     dateApplied: "10/14/2022",
//   },
// ];
