import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

function BackButton() {
  const router = useRouter();
  return (
    <IconButton
      sx={{
        ml: -1,
        p: 0,
      }}
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
    >
      <ArrowBackIosNewIcon sx={{ fontSize: 26 }} color="primary" />
    </IconButton>
  );
}

export default BackButton;
