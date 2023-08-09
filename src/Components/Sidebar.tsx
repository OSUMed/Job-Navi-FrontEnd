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
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, shortListItems, mediumListItems } from "./listItems";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Sidebar = () => {
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 1100,
        lg: 1600,
        xl: 1600,
      },
    },
  });
  const [open, setOpen] = useState(true);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));

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

        <List component="nav">
          {isSmallScreen
            ? shortListItems
            : isMediumScreen
            ? mediumListItems
            : mainListItems}

          <Divider sx={{ my: 1 }} />
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
