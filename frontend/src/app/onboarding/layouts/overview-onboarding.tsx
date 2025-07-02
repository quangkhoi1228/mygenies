"use client";

import { onboardingActions } from "@/redux/features/onboarding.slice";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function OverviewViewOnboarding({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onboardingActions.setDisableButtonContinue(true));
  }, [dispatch]);
  return (
    <Box
      height="calc(100% - 125px)"
      sx={{
        pt: 15,
        position: "relative",
      }}
    >
      <Stack justifyContent="center" textAlign="center">
        <Typography variant="h2" color="primary.darker" fontWeight={800}>
          {title}
        </Typography>

        <Typography variant="h4" color="primary.darker" sx={{ mt: 1.1, px: 4 }}>
          {description}
        </Typography>
        <Box sx={{ mt: 5 }}>
          <Image
            src="/assets/images/home/home-page.svg"
            alt="motivation-illustration"
            width={287}
            height={215}
          />
        </Box>
      </Stack>
    </Box>
  );
}
