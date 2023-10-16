import * as React from "react";

import Sidebar from "./Sidebar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Header from "./NaviBar";

export default function Notes() {
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{
          backgroundColor: "#F5F5F5",
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Header />
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
              Notes
            </Paper>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
