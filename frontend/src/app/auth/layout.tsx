import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        // backgroundImage: `url("/assets/background/overlay_login.png")`,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 15,
          left: 15,
        }}
      >
        <Image src="/favicon/favicon.ico" alt="logo" width={40} height={40} />
      </Box>
      <Box
        sx={{
          m: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
