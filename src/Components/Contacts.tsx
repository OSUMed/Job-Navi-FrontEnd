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
  GridRowModesModel,
  GridToolbar,
  GridActionsCellItem,
} from "@mui/x-data-grid";
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
} from "@/components/ui/dialog";
// Reusable Component Imports:
import CustomEditComponent from "./CustomEditComponent";
import { detailedDiff } from "deep-object-diff";
import Header from "./NavBar";
import ContactsForm from "./ContactsForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "@shadcn/ui/toast";
import { Toaster } from "@/components/ui/toaster";

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
  // const [pageSize, setPageSize] = React.useState<number>(20);
  // const [rowId, setRowId] = React.useState<number | null>();
  // const [editRowId, setEditRowId] = React.useState<number>(95);
  // const [loading, setLoading] = React.useState<boolean>(true);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const formRef = React.useRef(null);

  function resetForm() {
    formRef.current.reset();
  }
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
                onClick={() => setRowSave(params.row.rowId)}
                variant="contained"
              >
                Save
              </Button>
              <pre> </pre>
              <Button
                onClick={() => setRowCancel(params.row.rowId)}
                variant="contained"
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
              sx={{ mr: 1 }}
              onClick={() => setRowEdit(params.row.rowId)}
            >
              Update
            </Button>
            <br />
            <Button onClick={() => handleDelete(params.row.rowId)}>
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
            <Button
              onClick={() => setRowSave(params.row.contactId)}
              variant="contained"
            >
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
    // Required for Data table creation, if data grid doesn't have a height, it errors out(MUI bug):
    height: 500,
  };

  // function preventDefault(event: React.MouseEvent) {
  //   event.preventDefault();
  // }

  React.useEffect(() => {
    // setLoading(true);
    // const headers = {
    //   "Access-Control-Allow-Origin": "*", // Replace with the allowed origin
    // };
    Axios.get(`${hostURL}/contacts`)
      // Axios.get("https://jobtrackerbackend.up.railway.app/contacts", { headers })
      .then((response) => {
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
        console.log("response data is: ", response.data);
        setAllContacts(transformedContacts);
      })
      .catch((error) => {
        console.error("Error fetching contacts: ", error);
      })
      .finally(() => {
        // setLoading(false);
      });
  }, []);

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
      setOpen(false);
    } catch (error) {
      console.error("Error adding contact:", error);
    }
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
              color="primary"
              className="mr-2"
            >
              No
            </Button>
            <Button
              onClick={() => handleDataChangeDialog("Yes")}
              color="primary"
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  /*------------------------------------Delete Row Logic------------------------------------*/
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

  const handleDelete = async (contactId: string) => {
    try {
      await Axios.post(`${hostURL}/contacts/${contactId}/delete`);
      await fetchContacts();
      toast({
        description: "Contact deleted!",
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

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
                className="mb-2 border-2 z-10"
                onClick={() => setOpen(true)}
              >
                Add Contact
              </Button>
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
          <TableContainer component={Paper}>
            <Paper sx={dataGridStyles}>
              {renderConfirmDialog()}
              <DataGrid
                columns={columns}
                rows={allContacts}
                getRowHeight={() => "auto"}
                getRowId={(row) => row.rowId}
                editMode="row"
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                rowModesModel={rowModesModel}
                slots={{
                  toolbar: GridToolbar,
                }}
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
//     contactId: 95,
//     companyName: "Devshare",
//     fullName: "Elnar O'Sullivan",
//     title: "eosullivan2m@hc360.com",
//     email: "eosullivan2m@irs.gov",
//     phone:
//       "in quam fringilla rhoncus mauris enim leo rhoncus sed vestibulum sit amet cursus id",
//     relationship:
//       "felis fusce posuere felis sed lacus morbi sem mauris laoreet ut rhoncus aliquet pulvinar",
//     notes:
//       "id turpis integer aliquet massa id lobortis convallis tortor risus dapibus augue vel accumsan",
//     followUpDate: "6/24/2022",
//   },
//   {
//     contactId: 96,
//     companyName: "Eabox",
//     fullName: "Berty Key",
//     title: "bkey2n@ibm.com",
//     email: "bkey2n@nifty.com",
//     phone:
//       "libero non mattis pulvinar nulla pede ullamcorper augue a suscipit nulla elit ac nulla sed vel enim sit amet nunc",
//     relationship:
//       "posuere cubilia curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin mi sit amet lobortis",
//     notes:
//       "ac leo pellentesque ultrices mattis odio donec vitae nisi nam ultrices",
//     followUpDate: "1/3/2023",
//   },
//   {
//     contactId: 97,
//     companyName: "Minyx",
//     fullName: "Wiley Chattell",
//     title: "wchattell2o@google.co.uk",
//     email: "wchattell2o@who.int",
//     phone:
//       "orci nullam molestie nibh in lectus pellentesque at nulla suspendisse potenti cras in purus eu magna",
//     relationship:
//       "eget elit sodales scelerisque mauris sit amet eros suspendisse accumsan tortor quis turpis sed ante vivamus tortor duis mattis",
//     notes:
//       "gravida sem praesent id massa id nisl venenatis lacinia aenean sit amet justo morbi ut odio cras mi pede",
//     followUpDate: "9/13/2022",
//   },
//   {
//     contactId: 98,
//     companyName: "Vinder",
//     fullName: "Skipp Malzard",
//     title: "smalzard2p@nymag.com",
//     email: "smalzard2p@youku.com",
//     phone:
//       "quis libero nullam sit amet turpis elementum ligula vehicula consequat morbi a ipsum integer a",
//     relationship:
//       "eleifend pede libero quis orci nullam molestie nibh in lectus pellentesque at nulla suspendisse potenti",
//     notes:
//       "nibh in quis justo maecenas rhoncus aliquam lacus morbi quis tortor id nulla ultrices aliquet maecenas",
//     followUpDate: "6/4/2022",
//   },
//   {
//     contactId: 99,
//     companyName: "Meemm",
//     fullName: "Lazarus Danniel",
//     title: "ldanniel2q@marketwatch.com",
//     email: "ldanniel2q@abc.net.au",
//     phone:
//       "quisque id justo sit amet sapien dignissim vestibulum vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia",
//     relationship:
//       "pharetra magna ac consequat metus sapien ut nunc vestibulum ante ipsum primis in faucibus",
//     notes:
//       "erat fermentum justo nec condimentum neque sapien placerat ante nulla justo",
//     followUpDate: "7/23/2022",
//   },
//   {
//     contactId: 100,
//     companyName: "Twitterbeat",
//     fullName: "Lenee Marlowe",
//     title: "lmarlowe2r@bbb.org",
//     email: "lmarlowe2r@ow.ly",
//     phone:
//       "pulvinar sed nisl nunc rhoncus dui vel sem sed sagittis nam congue risus semper porta volutpat quam pede lobortis",
//     relationship:
//       "ut massa quis augue luctus tincidunt nulla mollis molestie lorem quisque ut erat",
//     notes: "nec dui luctus rutrum nulla tellus in sagittis dui vel nisl",
//     followUpDate: "12/8/2022",
//   },
// ];
