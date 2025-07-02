"use client";

import Loading from "@/app/loading";
import NavigateMobile from "@/components/navigate/navigate-mobile";
import { Box } from "@mui/material";
import { useWindowSize } from "@uidotdev/usehooks";
import React, { memo } from "react";
import HeaderDashboard from "./header-dashboard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const size = useWindowSize();
  const heightNavbar = 91;
  const heightBottomNav = 76;

  if (!size.height) {
    return <Loading />;
  }

  return (
    <LayoutDashboard
      size={size}
      heightNavbar={heightNavbar}
      heightBottomNav={heightBottomNav}
      children={children}
    />
  );
}
const LayoutDashboard = memo(
  ({
    children,
    size,
    heightNavbar,
    heightBottomNav,
  }: {
    children: React.ReactNode;
    size: any;
    heightNavbar: number;
    heightBottomNav: number;
  }) => (
    <Box
      height={size.height || 0}
      sx={{ position: "relative", overflow: "hidden", maxWidth: 425, mx: "auto" }}
    >
      <HeaderDashboard height={heightNavbar} />
      <Box
        sx={{
          height: (size.height || 0) - heightNavbar - heightBottomNav,
          overflow: "auto",
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari
          },
        }}
      >
        {children}
      </Box>
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: heightBottomNav }}>
        <NavigateMobile height={heightBottomNav} />
      </Box>
    </Box>
  )
);
