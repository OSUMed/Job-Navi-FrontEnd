import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ContactsIcon from "@mui/icons-material/Contacts";
import NotesIcon from "@mui/icons-material/Notes";
import { Link } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/contacts">
      <ListItemIcon>
        <ContactsIcon />
      </ListItemIcon>
      <ListItemText primary="Contacts" />
    </ListItemButton>
    <ListItemButton component={Link} to="/applications">
      <ListItemIcon>
        <AttachFileIcon />
      </ListItemIcon>
      <ListItemText primary="Applications" />
    </ListItemButton>
    <ListItemButton component={Link} to="/notes">
      <ListItemIcon>
        <NotesIcon />
      </ListItemIcon>
      <ListItemText primary="Notes" />
    </ListItemButton>
    <ListItemButton component={Link} to="/logout">
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText primary="Log Out" />
    </ListItemButton>
  </React.Fragment>
);

export const mediumListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/">
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/contacts">
      <ListItemText primary="Contacts" />
    </ListItemButton>
    <ListItemButton component={Link} to="/applications">
      <ListItemText primary="Applications" />
    </ListItemButton>
    <ListItemButton component={Link} to="/notes">
      <ListItemText primary="Notes" />
    </ListItemButton>
    <ListItemButton component={Link} to="/logout">
      <ListItemText primary="Log Out" />
    </ListItemButton>
  </React.Fragment>
);

export const shortListItems = (
  <React.Fragment>
    <ListItemButton
      component={Link}
      to="/"
      sx={{
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        marginLeft: "25px",
      }}
    >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
    </ListItemButton>
    <ListItemButton
      component={Link}
      to="/contacts"
      sx={{
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        marginLeft: "25px",
      }}
    >
      <ListItemIcon>
        <ContactsIcon />
      </ListItemIcon>
    </ListItemButton>
    <ListItemButton
      component={Link}
      to="/applications"
      sx={{
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        marginLeft: "25px",
      }}
    >
      <ListItemIcon>
        <AttachFileIcon />
      </ListItemIcon>
    </ListItemButton>
    <ListItemButton
      component={Link}
      to="/logout"
      sx={{
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        marginLeft: "25px",
      }}
    >
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
    </ListItemButton>
  </React.Fragment>
);
