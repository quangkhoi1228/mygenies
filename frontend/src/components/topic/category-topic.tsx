"use client";

import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { Box, Stack, IconButton, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import React, { memo, useState } from "react";
import Ticker from "@/assets/icons/Ticker";

function CategoryTopic({
  name,
  title,
  rolePlay,
  systemRole,
  status,
  handleNewConversation,
  handleContinueConversation,
}: {
  name: string;
  title: string;
  rolePlay: string;
  systemRole: string;
  status: "new" | "chatting" | "ended";
  handleNewConversation: () => void;
  handleContinueConversation: () => void;
}) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleClickTopic = () => {
    if (status === "new") {
      handleContinueConversation();
    } else {
      handleOpenDialog();
    }
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      sx={{ py: 0.5, cursor: "pointer", borderRadius: 1, "&:hover": { background: "#00000011" } }}
      onClick={handleClickTopic}
    >
      <Stack direction="row" alignItems="center" spacing={2.5}>
        <Box>
          <IconButton
            sx={{
              border: 3,
              borderColor: status === "ended" ? "primary.main" : "#381E7229",
              p: "4px",
              position: "relative",
            }}
          >
            <Box
              sx={{
                // background: " #DFE3E8",
                borderRadius: "50%",
                width: 44,
                height: 44,
                overflow: "hidden",
              }}
            >
              <Image
                src="/assets/images/chat/free-talk/avatar-bg.svg"
                alt="custom-category-topic"
                width={44}
                height={44}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </Box>
            {status === "ended" && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -5,
                  right: 0,
                  background: "white",
                  borderRadius: "100%",
                  width: 24,
                  height: 24,
                }}
              >
                <Ticker />
              </Box>
            )}
          </IconButton>
        </Box>
        <Stack>
          <Typography color="primary.dark" variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>
            {name}
          </Typography>
          <Typography>Doku role: {systemRole}</Typography>
          <Typography>Your role: {rolePlay}</Typography>
        </Stack>
      </Stack>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            position: "fixed",
            bottom: 0,
            m: 0,
            width: "100%",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
        BackdropProps={{
          sx: {
            background: "#D9D9D98F",
          },
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Stack direction="row" spacing={0.5} justifyContent="center">
            <InfoRoundedIcon color="warning" />
            <Typography
              textAlign="center"
              sx={{ color: "initial", fontSize: 15, fontWeight: "bold" }}
            >
              Do you want to continue?
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ justifyContent: "center" }}>
            <Typography textAlign="center" sx={{ color: "initial", fontSize: 12 }}>
              You leave at the half-conversation
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Stack spacing={1.5} sx={{ mb: 1.5 }}>
            <Button
              onClick={handleContinueConversation}
              color="primary"
              variant="contained"
              sx={{ width: 270 }}
            >
              {status === "ended" ? "View conversation" : "Continue"}
            </Button>
            <Button onClick={handleNewConversation} color="primary" variant="outlined">
              New conversation
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);
export default memo(CategoryTopic);
