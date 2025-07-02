"use client";

import { Stack, Container } from "@mui/material";

import { useWindowSize } from "@uidotdev/usehooks";
import { HEADER } from "@/layouts/config-layout";
import Header from "./components/header";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const size = useWindowSize();

  return (
    <Container component="main" sx={{ position: "relative" }}>
      <Stack
        sx={{
          pt: `${HEADER.H_DESKTOP_OFFSET}px`,
          m: "auto",
          minHeight: size.height,
          maxWidth: 425,
          margin: "auto",
        }}
      >
        <Header />
        {children}
      </Stack>
    </Container>
  );
}
