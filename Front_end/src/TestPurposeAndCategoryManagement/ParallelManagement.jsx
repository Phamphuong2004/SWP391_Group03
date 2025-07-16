import React from "react";
import TestCategoryManager from "../TestCategory/TestCategoryManager";
import TestPurposeManager from "../TestPurpose/TestPurposeManager";
import { Box, Grid, Typography } from "@mui/material";

export default function ParallelManagement() {
  return (
    <Box sx={{ flexGrow: 1, px: 2, py: 4 }}>
      <Typography
        variant="h5"
        fontWeight={900}
        color="primary"
        align="center"
        mb={4}
        sx={{ letterSpacing: 1 }}
      >
        Quản lý Test Category & Test Purpose Song Song
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <TestCategoryManager />
        </Grid>
        <Grid item xs={12} md={6}>
          <TestPurposeManager />
        </Grid>
      </Grid>
    </Box>
  );
}
