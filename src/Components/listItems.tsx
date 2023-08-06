import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ContactsIcon from "@mui/icons-material/Contacts";
import NotesIcon from "@mui/icons-material/Notes";
import { Link } from "react-router-dom";

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
  </React.Fragment>
);
