import React from "react";
import Image from "next/image";

import { Box } from "@mui/material";

function ChatAvatar() {
  return (
    <Box
      display="block"
      position="relative"
      borderRadius={1}
      bgcolor="white"
      sx={{ width: 31, height: 26, mb: 2 }}
    >
      <Image fill src="/assets/images/chat/free-talk/avatar-bg.svg" alt="avatar" />
    </Box>
  );
}

export default ChatAvatar;
