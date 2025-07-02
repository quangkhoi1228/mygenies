"use client";

import { Box } from "@mui/material";
import React from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import Loading from "@/app/loading";

export default function OnBoardingLayout({ children }: { children: React.ReactNode }) {
  const size = useWindowSize();

  return size.height ? (
    <Box height={size.height} sx={{ position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          height: size.height,
          overflow: "auto",
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari
          },
        }}
      >
        {children}
      </Box>
    </Box>
  ) : (
    <Loading />
  );
}
