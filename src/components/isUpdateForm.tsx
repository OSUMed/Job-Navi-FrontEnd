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
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { detailedDiff } from "deep-object-diff";
import { Button } from "@/components/ui/button";
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
  
  export default const isUpdateForm = ({changedKeys, differences, confirmData, handleDataChangeDialog}) => {
    return(
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
    )