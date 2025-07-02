"use client";

import { Box, Stack, IconButton, Typography } from "@mui/material";
import AddIcon from "@/assets/icons/AddIcon";

export default function CustomCategoryTopic({ onClick }: { onClick: () => void }) {
  return (
    <Box
      sx={{ py: 0.5, cursor: "pointer", borderRadius: 1, "&:hover": { background: "#00000011" } }}
      onClick={onClick}
    >
      <Stack direction="row" alignItems="center" spacing={2.5}>
        <Box sx={{ ml: 0.5 }}>
          <IconButton sx={{ border: "3px solid #381E7229", p: "4px" }}>
            <Box
              sx={{
                border: "2px solid transparent",
                background: " #DFE3E8",
                borderRadius: "50%",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AddIcon />
            </Box>
          </IconButton>
        </Box>
        <Box>
          <Typography
            color="primary.dark"
            sx={{ borderBottom: 1, borderColor: "primary.dark", fontWeight: 600 }}
          >
            Create custom topic
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
