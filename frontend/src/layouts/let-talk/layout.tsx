"use client";

import { Box } from "@mui/material";
import React from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import Loading from "@/app/loading";
import NavigateMobile from "@/components/navigate/navigate-mobile";
import HeaderLetTalk from "./header-let-talk";
import GroupTab from "./group-tab";

export default function LetTalkLayout({ children }: { children: React.ReactNode }) {
  const size = useWindowSize();
  const heightNavbar = 91;
  const heightBottomNav = 76;
  const heightGroupTab = 51;
  return size.height ? (
    <Box
      height={size.height}
      sx={{ position: "relative", overflow: "hidden", maxWidth: 425, mx: "auto" }}
    >
      <HeaderLetTalk height={heightNavbar} />
      <Box
        sx={{
          px: 2,
          height: size.height - heightNavbar - heightBottomNav - heightGroupTab,
          // overflow: "auto",
          // scrollbarWidth: "none", // Firefox
          // "&::-webkit-scrollbar": {
          //   display: "none", // Chrome, Safari
          // },
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: heightBottomNav,
          left: 0,
          right: 0,
          height: heightGroupTab,
        }}
      >
        <GroupTab />
      </Box>
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: heightBottomNav }}>
        <NavigateMobile height={heightBottomNav} />
      </Box>
    </Box>
  ) : (
    <Loading />
  );
}
