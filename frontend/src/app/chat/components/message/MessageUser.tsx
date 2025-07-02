import { Box, Stack, IconButton } from "@mui/material";
import React, { memo, useState, useEffect, useCallback } from "react";
import FeedBackDialog from "@/app/chat/components/dialog/FeedBackDialog";
import FeedbackIcon from "@/assets/icons/FeedbackIcon";

function MessageUser({ data }: { data?: any }) {
  const elemRef = React.useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadDialog, setLoadDialog] = useState(false);
  useEffect(() => {
    if (dialogOpen) {
      setLoadDialog(true);
    }
  }, [dialogOpen]);
  const handleDialog = useCallback((status: boolean) => {
    setDialogOpen(status);
  }, []);
  const handleOpenDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);
  React.useEffect(() => {
    if (elemRef.current) {
      elemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);
  return (
    <>
      <Stack ref={elemRef} direction="row" justifyContent="end">
        <Box maxWidth="26.33%">
          <Stack direction="row" spacing={1.2} alignItems="end" justifyContent="end" height="100%">
            <Box sx={{ mr: 0 }}>
              <IconButton
                // size="small"
                // variant="outlined"
                sx={{ p: 0, mr: 0.4 }}
                onClick={handleOpenDialog}
              >
                <FeedbackIcon />
              </IconButton>
            </Box>
          </Stack>
        </Box>
        <Box maxWidth="73.67%">
          <Box
            sx={{
              borderRadius: "10px",
              borderBottomRightRadius: "0px",
              p: 1.2,
              backgroundColor: "rgba(24, 119, 242, 0.21)",
              color: "rgba(24, 119, 242, 1)",
              fontSize: 14,
              lineHeight: "22px",
            }}
          >
            {data?.sentence}
          </Box>
        </Box>
      </Stack>
      {loadDialog ? (
        <FeedBackDialog open={dialogOpen} handleDialog={handleDialog} message={data?.sentence} />
      ) : (
        ""
      )}
    </>
  );
}
export default memo(MessageUser);
