import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@material-ui/core";

interface ConfirmDialogProps {
  confirmData: any;
  handleDataChangeDialog: (response: string) => void;
  changedKeys: string[];
  differences: any;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  confirmData,
  handleDataChangeDialog,
  changedKeys,
  differences,
}) => {
  return (
    <Dialog maxWidth="xs" open={confirmData}>
      <DialogTitle>Confirm Update</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          You are about to update the following information:
        </Typography>
        {changedKeys.map((key) => (
          <div
            key={key}
            style={{
              backgroundColor: "#f8f8f8",
              padding: "8px",
              border: "1px solid #ccc",
              marginBottom: "8px",
            }}
          >
            <strong>{key}:</strong>{" "}
            {differences.updated[key as keyof typeof differences.updated]}
          </div>
        ))}
        <Typography variant="body1" gutterBottom style={{ marginTop: "1em" }}>
          Are you sure you want to proceed?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleDataChangeDialog("No")} color="primary">
          No
        </Button>
        <Button onClick={() => handleDataChangeDialog("Yes")} color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
