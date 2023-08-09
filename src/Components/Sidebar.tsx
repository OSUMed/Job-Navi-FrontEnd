import React, { useState } from "react";
import {
  Drawer,
  Toolbar,
  IconButton,
  Divider,
  List,
  Box,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, shortListItems } from "./listItems";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1100,
    },
  },
});

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isCustomBreakpoint = useMediaQuery(theme.breakpoints.down("xl"));
  console.log("issmall screen is: ", isCustomBreakpoint);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // const sidebarWidth = open ? "100%" : "0%";

  return (
    <Box sx={{ display: "flex", zIndex: open ? 800 : 800 }}>
      <Drawer
        variant="permanent"
        sx={{
          flexShrink: 0,

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
        {!isCustomBreakpoint ? (
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
          </List>
        ) : (
          <List component="nav">
            {shortListItems}
            <Divider sx={{ my: 1 }} />
          </List>
        )}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
