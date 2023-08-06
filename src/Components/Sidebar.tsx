import React, { useState } from "react";
import { Drawer, Toolbar, IconButton, Divider, List } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems } from "./listItems";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const sidebarWidth = open ? "100%" : "0%";

  return (
    <Drawer
      variant="permanent"
      sx={{
        paddingRight: 300,
        "& > .MuiPaper-root": {
          width: open ? "10%" : "3%",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {mainListItems}
        <Divider sx={{ my: 1 }} />
      </List>
    </Drawer>
  );
};

export default Sidebar;
