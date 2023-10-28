import * as React from "react";
import Axios from "axios";
import {
  TableContainer,
  Paper,
  Box,
  DialogActions,
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
  GridRowSelectionModel,
  GridRowModesModel,
  GridToolbar,
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
import EditIcon from "./ui/EditIcon";
import ContactsSidebar from "./ContactsSidebar";

// Update with the correct path

// import Axios from "axios";
// const hostURL = "http://localhost:8080";
// const hostURL = "https://jobtrackerbackend.up.railway.app/";
const hostURL =
  "https://cors-anywhere-osu.up.railway.app/https://jobtrackerbackend.up.railway.app/api";
// Interface for Jobs:
interface Contact {
  rowId: GridRowId;
  companyName?: string;
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  relationship?: string;
  notes?: string;
  followUpDate?: string | Date;
}

// interface ContactsResponse {
//   contacts: Contact[];
// }
interface PropTypes {
  cookie: {
    session: string;
  };
}
const fields = [
  {
    label: "Company Name",
    name: "companyName",
    type: "text",
    required: true,
    placeholder: "Enter company name..",
  },
  {
    label: "Full Name",
    name: "fullName",
    type: "text",
    required: true,
    placeholder: "Enter full name..",
  },
  {
    label: "Title",
    name: "title",
    type: "text",
    placeholder: "Enter title..",
  },
  {
    label: "Email",
    name: "email",
    type: "text",
    required: true,
    placeholder: "Enter email..",
  },
  {
    label: "Phone",
    name: "phone",
    type: "text",
    required: true,
    placeholder: "Enter phone..",
  },
  {
    label: "Relationship",
    name: "relationship",
    type: "text",
    required: true,
    placeholder: "Enter relationship..",
  },
  {
    label: "Notes",
    name: "notes",
    type: "text",
    required: true,
    placeholder: "Enter notes..",
  },
  {
    label: "Follow Up Date",
    name: "followUpDate",
    type: "date",
    required: true,
    placeholder: "Enter follow-up date..",
  },
];
// Source: https://stackoverflow.com/questions/70361697/how-to-change-text-color-of-disabled-mui-text-field-mui-v5
const CustomDisabledTextField = styled(TextField)(() => ({
  ".MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#000",
    color: "#000",
  },
}));

export default function Contacts({ cookie }: PropTypes) {
  const [allContacts, setAllContacts] = React.useState<GridRowsProp>([]);
  const [confirmData, setConfirmData] = React.useState<any>(null);
  const [addContact, setAddContact] = React.useState<Contact>({
    rowId: "",
    companyName: "",
    fullName: "",
    title: "",
    email: "",
    phone: "",
    relationship: "",
    notes: "",
    followUpDate: "",
  });
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const [sheetVisible, setSheetVisible] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);

  const [selectedRowData, setSelectedRowData] = React.useState<any | null>(
    null
  );
  const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);
  // const [pageSize, setPageSize] = React.useState<number>(20);
  // const [rowId, setRowId] = React.useState<number | null>();
  // const [editRowId, setEditRowId] = React.useState<number>(95);
  // const [loading, setLoading] = React.useState<boolean>(true);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  React.useEffect(() => {
    console.log("Current row selection model:", rowSelectionModel);
    console.log("Current selected row data:", selectedRowData);
  }, [rowSelectionModel, selectedRowData]);

  const formRef = React.useRef(null);

  const columns: GridColDef[] = [
    {
      field: "companyName",
      headerName: "Company Name",
      width: 150,
      editable: false,
      sortable: true,
      // This will render the cell how you want it. Instead of a regular cell, I want to create a textfield so I don't have to scroll
      // right when the message is too long(textfield wraps text around)
    },
    {
      field: "fullName",
      headerName: "Full Name",
      width: 150,
      editable: true,
      sortable: true,
    },
    // {
    //   field: "title",
    //   headerName: "Title",
    //   width: 150,
    //   editable: true,
    //   sortable: true,
    // },
    {
      field: "email",
      headerName: "Email",
      // hide: true,
      width: 190,
      editable: true,
      sortable: true,
    },
    // {
    //   field: "phone",
    //   headerName: "Phone",
    //   width: 130,
    //   editable: true,
    //   sortable: true,
    // },
    {
      field: "notes",
      headerName: "Notes",
      width: 320,
      // hide: true,
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
          defaultValue={params.row.notes}
          value={params.row.notes}
        />
      ),
      renderEditCell: CustomEditComponent,
    },
    {
      field: "followUpDate",
      headerName: "Follow Up",
      width: 100,
      sortable: true,
      // Date Styling addon- Delete if not needed later
      // renderCell: (data) => moment(data).format("YYYY-MM-DD HH:MM:SS"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;
        // console.log("what is isInEditMode: ", params);
        if (isInEditMode) {
          console.log("IneditMode outside setRowSave call: ", params);
          return (
            <>
              <Button
                className="bg-green-600 hover:bg-green-700 m-4"
                onClick={() => setRowSave(params.row.rowId)}
              >
                Save
              </Button>
              <pre> </pre>
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
      renderEditCell: (params) => {
        // const isInEditMode =
        //   rowModesModel[params.id]?.mode === GridRowModes.Edit;
        // console.log("what is isInEditMode: ", isInEditMode);
        // if (isInEditMode) {
        return (
          <>
            <Button onClick={() => setRowSave(params.row.contactId)}>
              Save
            </Button>
            <br />
            <GridActionsCellItem
              onClick={() => setRowCancel(params.row.contactId)}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
            />
          </>
        );
      },
    },
  ];
  const dataGridStyles: SxProps = {
    // Required for Data table creation, if data grid doesn't have a height, it errors out(MUI bug)):
    height: 500,
  };

  React.useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await Axios.get(`${hostURL}/contacts`);
      const transformedContacts = response.data.map((contact: Contact) => ({
        rowId: contact.rowId,
        companyName: contact.companyName,
        fullName: contact.fullName,
        title: contact.title,
        email: contact.email,
        phone: contact.phone,
        relationship: contact.relationship,
        notes: contact.notes,
        followUpDate: contact.followUpDate,
      }));
      setAllContacts(transformedContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  /*------------------------------------Create/Add Row Logic------------------------------------*/

  const handleChangeAddContact = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("new contact change is: ", addContact);
    // Store name attribute value and cell value as new field entry:
    const inputField = e.target.getAttribute("name");
    const inputValue = e.target.value;
    const newContact = { ...addContact };
    // Typescript typing error workaround:
    // https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b
    newContact[inputField as keyof typeof newContact] = inputValue;
    setAddContact(newContact);
  };

  const handleAddContactFormSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    console.log("new contact is: ", addContact);
    const newContact = {
      contactId: randomId(),
      companyName: addContact.companyName,
      fullName: addContact.fullName,
      title: addContact.title,
      email: addContact.email,
      phone: addContact.phone,
      relationship: addContact.relationship,
      notes: addContact.notes,
      followUpDate: addContact.followUpDate,
    };
    try {
      await Axios.post(`${hostURL}/contacts`, newContact);
      await fetchContacts();
      e.currentTarget.reset();
      toast({
        description: "Contact Added!",
        duration: 2000,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  /*------------------------------------ Change Table Views(not update) ------------------------------------*/

  const setRowEdit = (id: GridRowId) => {
    console.log("We just setRowEdit");
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  const setRowSave = async (id: GridRowId) => {
    console.log("We just setRowSAVE");
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  const setRowCancel = (id: GridRowId) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  /*------------------------------------Update/Edit Cell Dialog Logic------------------------------------*/

  // Editable Cells: new data saved in confirmData
  // the datagrid API option that I enabled saves the "current row" and "the row before it was edited" so we can access
  // them and pick which one to render based on user confirmation:
  const processRowUpdate = React.useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel) =>
      new Promise<GridRowModel>((resolve, reject) => {
        setConfirmData({ resolve, reject, newRow, oldRow });
      }),
    []
  );

  // Handles Errors:
  const handleProcessRowUpdateError = (error: Error) => {
    console.log(error);
  };

  // User chooses dialog options on editted cell:
  const handleDataChangeDialog = async (response: string) => {
    const { newRow, oldRow, resolve } = confirmData;
    console.log("What is the new row? ", newRow);
    // console.log("New row is: ", newRow, newRow.jobId);
    // If user responds yes, send new row to database, else resolve old row back:
    if (response === "Yes") {
      try {
        const updContact: Contact = {
          rowId: newRow.rowId,
          companyName: newRow.companyName,
          fullName: newRow.fullName,
          title: newRow.title,
          email: newRow.email,
          phone: newRow.phone,
          relationship: newRow.relationship,
          notes: newRow.notes,
          followUpDate: newRow.followUpDate,
        };
        console.log("UpdContact is: ", updContact);
        await Axios.post(`${hostURL}/contacts/${newRow.rowId}`, updContact);
        resolve(newRow);
        handleSheetOpenChange(false);
      } catch (error) {
        console.error("Error updating contact:", error);
      }
    } else if (response === "No") {
      resolve(oldRow);
    }
    setConfirmData(null);
  };

  // Promise resolved based on user dialog response:
  const renderConfirmDialog = () => {
    // Case 1: Errors:
    if (!confirmData) {
      return null;
    }
    const { newRow, oldRow, resolve } = confirmData;
    console.log("what is row right renderConfirmDialog: ", newRow);
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
          <Typography variant="body1" gutterBottom style={{ marginTop: "1em" }}>
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
    );
  };

  /*------------------------------------Delete Row Logic------------------------------------*/

  const handleDelete = async (contactId: string) => {
    try {
      await Axios.post(`${hostURL}/contacts/${contactId}/delete`);
      await fetchContacts();
      toast({
        description: "Contact deleted!",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
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

  // const handleRowSelection = (newSelection: any) => {
  //   // setSelectedRowId(event[0]);
  //   if (newSelection.length) {
  //     console.log("logged event is: ", event);
  //     const selectedRowId = newSelection[0];
  //     console.log("selectedRowId: ", selectedRowId, typeof selectedRowId);

  //     const rowData = allContacts.find((row) => row.rowId === selectedRowId);
  //     console.log("rowdata: ", rowData, sheetVisible);
  //     setSelectedRow(selectedRowData);
  //     setSelectedRowData(rowData);
  //   } else {
  //     setSelectedRow(null);
  //   }

  // const handleRowSelection = (newRowSelectionModel: GridRowSelectionModel) => {
  //   let newSelectedRowId = newRowSelectionModel[0];
  //   // If more than one row is selected, keep only the latest selected row
  //   if (newRowSelectionModel.length > 1) {
  //     let pickLastElement = newRowSelectionModel.length - 1;
  //     setRowSelectionModel([newRowSelectionModel[pickLastElement]]);
  //   } else {
  //     setRowSelectionModel(newRowSelectionModel);
  //   }
  //   const currentRowData = allContacts.find((row) => row.rowId === newSelectedRowId);
  //   setSelectedRowData(currentRowData);
  // };

  const handleRowSelection = (newRowSelectionModel: GridRowSelectionModel) => {
    // Directly pick the last selected row's ID
    const latestSelectedRowId =
      newRowSelectionModel[newRowSelectionModel.length - 1];

    // Only set the latest selection to state
    setRowSelectionModel([latestSelectedRowId]);

    // Find the data for latest selected row and set it
    const currentRowData = allContacts.find(
      (row) => row.rowId === latestSelectedRowId
    );
    setSelectedRowData(currentRowData);
  };

  const handleSidebarView = () => {
    // Assuming you already have the selectedRowData set when a row is clicked.
    // Ensure that there's selected data before showing the sidebar
    selectedRowData
      ? setSheetVisible(true)
      : toast({
          description:
            "Select a row and press 'View Contact Details' to see more in the sidebar!",
          duration: 2000,
        });
  };

  const handleRowDoubleClick = (params: any) => {
    setSelectedRowId(params.id);

    const rowData = allContacts.find((row) => row.rowId === params.id);
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
              <>
                <>
                  {/* Primary Action: Add Contact */}
                  <Button
                    className="mr-2 mb-2 bg-purple-500 text-white hover:bg-purple-600 px-4 py-2 rounded transition duration-200 ease-in"
                    onClick={() => setOpen(true)}
                  >
                    <AddIcon /> Add Contact
                  </Button>

                  {/* Secondary Action: Edit Contact */}
                  <Button
                    className="mb-2 border bg-white border-blue-500 text-blue-500 hover:bg-blue-100 hover:text-blue-600 px-4 py-2 rounded transition duration-200 ease-in"
                    onClick={handleSidebarView}
                  >
                    <EditIcon />{" "}
                    <span className="ml-2">View Contact Details</span>
                  </Button>
                </>
              </>

              {/* <Button
                variant="outline"
                className="text-blue-600 border-blue-600 mb-2 border-2 z-10"
              >
                Add Contact
              </Button> */}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Contact</DialogTitle>
                <DialogDescription>
                  Add New Contact and Press Enter
                </DialogDescription>
              </DialogHeader>
              <ContactsForm
                onSubmit={handleAddContactFormSubmit}
                onChange={handleChangeAddContact}
                setOpen={setOpen}
                addContact={addContact}
                fetchContacts={fetchContacts}
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
              <ContactsSidebar
                setAllContacts={setAllContacts}
                allContacts={allContacts}
                selectedRowData={selectedRowData}
                // updateOnChangeSidebar={updateOnChangeSidebar}
                // setFormData={setFormData}
                // handleSidebarSave={handleSidebarSave}
                // formData={formData}

                processRowUpdate={processRowUpdate}
                // setSelectedRow={setSelectedRowId}
              />
            </SheetContent>
          </Sheet>
          <TableContainer component={Paper}>
            <Paper sx={dataGridStyles}>
              {renderConfirmDialog()}
              <DataGrid
                columns={columns}
                rows={allContacts}
                getRowHeight={() => "auto"}
                getRowId={(row) => row.rowId}
                editMode="row"
                rowModesModel={rowModesModel}
                // These 2 props to confirm changes to row:
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                slots={{
                  toolbar: GridToolbar,
                }}
                // Sidebar logic:
                onRowSelectionModelChange={handleRowSelection}
                rowSelectionModel={rowSelectionModel}
                // onRowDoubleClick={handleRowDoubleClick}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[10, 15, 25]}
                checkboxSelection
              />
            </Paper>
          </TableContainer>
        </Paper>
      </Container>

      <Toaster />
    </Box>
  );
}
