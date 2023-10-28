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
import MicIcon from "@mui/icons-material/Mic";
import HandshakeIcon from "@mui/icons-material/Handshake";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CreateIcon from "@mui/icons-material/Create";
import MailIcon from "@mui/icons-material/Mail";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [filteredApplications, setFilteredApplications] =
    React.useState<GridRowsProp>([]);
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
      setFilteredApplications(transformedApplications);
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
      toast({
        description: "Application Added!",
        duration: 2000,
      });
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
          description: "Application Updated!",
          duration: 2000,
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
        description: "Application deleted!",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  /*------------------------------------Sidebar Logic------------------------------------*/

  // Only if button is clicked, open sidebar:
  // const handleOpenSheet = () => {
  //   if (selectedRow) {
  //     const rowData = filteredApplications.find((row) => row.rowId === selectedRow);
  //     setSelectedRowData(rowData);
  //     setSheetVisible(true);
  //   }
  // };

  const handleRowSelection = (event: any) => {
    // setSelectedRowId(event[0]);
    const selectedRowId = event[0];
    console.log("selectedRowId: ", selectedRowId, typeof selectedRowId);
    setSelectedRow(selectedRowId);

    const rowData = filteredApplications.find(
      (row) => row.rowId === selectedRowId
    );
    console.log("rowdata: ", rowData, sheetVisible);
    setSelectedRowData(rowData);
  };
  const handleRowDoubleClick = (params: any) => {
    setSelectedRow(params.id);

    const rowData = filteredApplications.find((row) => row.rowId === params.id);
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
  //     const updatedApplications = filteredApplications.map((application) =>
  //       application.rowId === formData.rowId ? formData : application
  //     );
  //     setFilteredApplications(updatedApplications);
  //   } catch (error) {
  //     console.error("Failed to update row:", error);
  //   }
  // };

  const filterDataByStatus = (statusChoice: String) => {
    let currentFilteredApplications = allApplications.filter(
      (application) => application.status == statusChoice
    );
    setFilteredApplications(currentFilteredApplications);
    toast({
      description: `Filtered by ${statusChoice}`,
      duration: 2000,
    });
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
          <div className="block sm:block md:block lg:hidden ">
            <div className="flex space-x-4 ">
              <Card
                onClick={() => filterDataByStatus("Bookmarked")}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 w-1/6 truncate flex justify-center items-center"
              >
                <CardHeader className="">
                  <BookmarkIcon />
                </CardHeader>
              </Card>

              <Card
                onClick={() => filterDataByStatus("Applying")}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 w-1/6 truncate flex justify-center items-center pb-4"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
                  <CreateIcon />
                </CardHeader>
              </Card>
              <Card
                onClick={() => filterDataByStatus("Applied")}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 w-1/6 truncate flex justify-center items-center pb-3"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
                  <MailIcon />
                </CardHeader>
              </Card>
              <Card
                onClick={() => filterDataByStatus("Interviewing")}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 w-1/6 truncate flex justify-center items-center pb-3"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center justify-center h-6 w-6">
                    <MicIcon />
                  </div>
                </CardHeader>
              </Card>
              <Card
                onClick={() => filterDataByStatus("Negotiating")}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 w-1/6 truncate flex justify-center items-center pb-3"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center justify-center h-6 w-6">
                    <HandshakeIcon />
                  </div>
                </CardHeader>
              </Card>
              <Card
                onClick={() => filterDataByStatus("Accepted")}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 w-1/6 truncate flex justify-center items-center pb-3"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center justify-center h-6 w-6">
                    <EmojiEventsIcon />
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
          <div className="hidden sm:hidden md:hidden lg:block">
            <div className="flex space-x-4">
              <Card
                onClick={() => filterDataByStatus("Bookmarked")}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 w-1/6"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium truncate">
                    Bookmarked
                  </CardTitle>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.5 2C3.22386 2 3 2.22386 3 2.5V13.5C3 13.6818 3.09864 13.8492 3.25762 13.9373C3.41659 14.0254 3.61087 14.0203 3.765 13.924L7.5 11.5896L11.235 13.924C11.3891 14.0203 11.5834 14.0254 11.7424 13.9373C11.9014 13.8492 12 13.6818 12 13.5V2.5C12 2.22386 11.7761 2 11.5 2H3.5Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground truncate">
                    Filter: Bookmarked
                  </p>
                </CardContent>
              </Card>

              <Card
                onClick={() => filterDataByStatus("Applying")}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 w-1/6"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
                  <CardTitle className="text-sm font-medium truncate">
                    Applying
                  </CardTitle>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.1464 1.14645C12.3417 0.951184 12.6583 0.951184 12.8535 1.14645L14.8535 3.14645C15.0488 3.34171 15.0488 3.65829 14.8535 3.85355L10.9109 7.79618C10.8349 7.87218 10.7471 7.93543 10.651 7.9835L6.72359 9.94721C6.53109 10.0435 6.29861 10.0057 6.14643 9.85355C5.99425 9.70137 5.95652 9.46889 6.05277 9.27639L8.01648 5.34897C8.06455 5.25283 8.1278 5.16507 8.2038 5.08907L12.1464 1.14645ZM12.5 2.20711L8.91091 5.79618L7.87266 7.87267L8.12731 8.12732L10.2038 7.08907L13.7929 3.5L12.5 2.20711ZM9.99998 2L8.99998 3H4.9C4.47171 3 4.18056 3.00039 3.95552 3.01877C3.73631 3.03668 3.62421 3.06915 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3.06915 3.62421 3.03669 3.73631 3.01878 3.95552C3.00039 4.18056 3 4.47171 3 4.9V11.1C3 11.5283 3.00039 11.8194 3.01878 12.0445C3.03669 12.2637 3.06915 12.3758 3.10899 12.454C3.20487 12.6422 3.35785 12.7951 3.54601 12.891C3.62421 12.9309 3.73631 12.9633 3.95552 12.9812C4.18056 12.9996 4.47171 13 4.9 13H11.1C11.5283 13 11.8194 12.9996 12.0445 12.9812C12.2637 12.9633 12.3758 12.9309 12.454 12.891C12.6422 12.7951 12.7951 12.6422 12.891 12.454C12.9309 12.3758 12.9633 12.2637 12.9812 12.0445C12.9996 11.8194 13 11.5283 13 11.1V6.99998L14 5.99998V11.1V11.1207C14 11.5231 14 11.8553 13.9779 12.1259C13.9549 12.407 13.9057 12.6653 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.6653 13.9057 12.407 13.9549 12.1259 13.9779C11.8553 14 11.5231 14 11.1207 14H11.1H4.9H4.87934C4.47686 14 4.14468 14 3.87409 13.9779C3.59304 13.9549 3.33469 13.9057 3.09202 13.782C2.7157 13.5903 2.40973 13.2843 2.21799 12.908C2.09434 12.6653 2.04506 12.407 2.0221 12.1259C1.99999 11.8553 1.99999 11.5231 2 11.1207V11.1206V11.1V4.9V4.87935V4.87932V4.87931C1.99999 4.47685 1.99999 4.14468 2.0221 3.87409C2.04506 3.59304 2.09434 3.33469 2.21799 3.09202C2.40973 2.71569 2.7157 2.40973 3.09202 2.21799C3.33469 2.09434 3.59304 2.04506 3.87409 2.0221C4.14468 1.99999 4.47685 1.99999 4.87932 2H4.87935H4.9H9.99998Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </CardHeader>
                <CardContent>
                  {/* <div className="text-2xl font-bold">Hold</div> */}
                  <p className="text-xs text-muted-foreground truncate">
                    Filter: Applying
                  </p>
                </CardContent>
              </Card>
              <Card
                onClick={() => filterDataByStatus("Applied")}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 w-1/6"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium truncate">
                    Applied
                  </CardTitle>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 2C0.447715 2 0 2.44772 0 3V12C0 12.5523 0.447715 13 1 13H14C14.5523 13 15 12.5523 15 12V3C15 2.44772 14.5523 2 14 2H1ZM1 3L14 3V3.92494C13.9174 3.92486 13.8338 3.94751 13.7589 3.99505L7.5 7.96703L1.24112 3.99505C1.16621 3.94751 1.0826 3.92486 1 3.92494V3ZM1 4.90797V12H14V4.90797L7.74112 8.87995C7.59394 8.97335 7.40606 8.97335 7.25888 8.87995L1 4.90797Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </CardHeader>
                <CardContent>
                  {/* <div className="text-2xl font-bold">Hold</div> */}
                  <p className="text-xs text-muted-foreground truncate">
                    Filter: Applied
                  </p>
                </CardContent>
              </Card>
              <Card
                onClick={() => filterDataByStatus("Interviewing")}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 w-1/6"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium truncate">
                    Interviewing
                  </CardTitle>
                  <MicIcon />
                </CardHeader>
                <CardContent>
                  {/* <div className="text-2xl font-bold">Hold</div> */}
                  <p className="text-xs text-muted-foreground truncate">
                    Filter: Interviewing
                  </p>
                </CardContent>
              </Card>
              <Card
                onClick={() => filterDataByStatus("Negotiating")}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 w-1/6"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium truncate">
                    Negotiating
                  </CardTitle>
                  <HandshakeIcon />
                </CardHeader>
                <CardContent>
                  {/* <div className="text-2xl font-bold">Hold</div> */}
                  <p className="text-xs text-muted-foreground truncate">
                    Filter: Negotiating
                  </p>
                </CardContent>
              </Card>
              <Card
                onClick={() => filterDataByStatus("Accepted")}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 w-1/6"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium truncate">
                    Accepted
                  </CardTitle>
                  <EmojiEventsIcon />
                </CardHeader>
                <CardContent>
                  {/* <div className="text-2xl font-bold">Hold</div> */}
                  <p className="text-xs text-muted-foreground truncate">
                    Filter: Accepted
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="mb-2 mt-4 border bg-white border-purple-500 text-purple-500 hover:bg-purple-100 hover:text-purple-600 px-4 py-2 rounded transition duration-200 ease-in"
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
                setAllApplications={setFilteredApplications}
                allApplications={filteredApplications}
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
                rows={filteredApplications}
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
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[10, 15, 25]}
              />
            </Paper>
          </TableContainer>
        </Paper>
      </Container>

      <Toaster />
    </Box>
  );
}
