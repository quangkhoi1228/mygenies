"use client";

import { Box, Stack } from "@mui/material";
import React, { memo } from "react";
import ChatAvatar from "../ChatAvatar";

function MessageAuto({ text }: { text: string }) {
  const elemRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (elemRef.current) {
      elemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  });
  return (
    <Stack direction="row" ref={elemRef}>
      <Box>
        <ChatAvatar />
      </Box>
      <Box maxWidth="73.67%">
        <Box
          sx={{
            borderRadius: "10px",
            borderBottomLeftRadius: "0px",
            p: 1.2,
            backgroundColor: "rgba(145, 158, 171, 0.2)",
            color: "rgba(0, 75, 80, 1)",
            fontSize: 14,
            lineHeight: "22px",
          }}
        >
          {text}
        </Box>
      </Box>
      <Box maxWidth="26.33%">
        <Stack direction="row" spacing={1.2} alignItems="end" height="100%">
          {}
        </Stack>
      </Box>
    </Stack>
  );
}
export default memo(MessageAuto);
