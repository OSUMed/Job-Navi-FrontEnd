import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { mainListItems } from "./listItems";
import Contacts from "./Contacts";
import Applications from "./Applications";
import Sidebar from "./Sidebar";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex", backgroundColor: "#F5F5F5" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          backgroundColor: "#F5F5F5",
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
              }}
            >
              Applications
            </Paper>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
