"use client";

import { Box, Stack, Button, useTheme, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OverviewSurvey() {
  const theme = useTheme();
  const router = useRouter();

  const handleContinue = () => {
    router.push("/onboarding/survey");
  };

  return (
    <Box
      height="100%"
      sx={{ backgroundColor: theme.palette.primary.light, pt: 14.1, position: "relative" }}
    >
      <Stack justifyContent="center" textAlign="center" spacing={0.8}>
        <Typography variant="h2" color="primary.darker">
          Alola! 👋
        </Typography>
        <Typography variant="h4" color="primary.darker">
          Language make Dream come true
        </Typography>

        <Box sx={{ mt: 5 }}>
          <Image
            src="/assets/images/home/home-page.svg"
            alt="motivation-illustration"
            width={319}
            height={249}
          />
        </Box>
      </Stack>
      <Box sx={{ position: "absolute", bottom: 70, right: 15, left: 15, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ minHeight: 48, minWidth: 180 }}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}
