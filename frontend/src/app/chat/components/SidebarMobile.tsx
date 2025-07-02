import dynamic from "next/dynamic";
import React, { memo, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { clearChatFreeTalkMessage } from "@/redux/features/chatFreeTalk.slice";

import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { TransitionProps } from "@mui/material/transitions";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { Box, Stack, Button, Typography } from "@mui/material";
import DialogContentText from "@mui/material/DialogContentText";

import RecordButton from "./button/RecordButton";

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

const IdeasDialog = dynamic(() => import("./dialog/IdeasDialog"), {
  ssr: false,
});

function SidebarMobile({ topText }: { topText?: string }) {
  const size = useWindowSize();
  const router = useRouter();
  // const pathname = usePathname();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const handleDialog = (status: boolean) => {
    setOpenDialog(status);
  };
  const handleClose = () => {
    dispatch(clearChatFreeTalkMessage());
    if (ref) {
      router.push(ref);
    } else {
      router.back();
    }
  };
  // const handleOpenDialog = () => {
  //   setOpenDialog(true);
  // };

  const [openDialogClose, setOpenDialogClose] = useState(false);
  // const { status } = useSelector((state: RootState) => state.chatFreeTalkState);
  const handleDialogClose = () => {
    setOpenDialogClose(false);
  };
  // const handleOpenDialogClose = () => {
  //   if (status === "end") {
  //     handleClose();
  //   } else {
  //     setOpenDialogClose(true);
  //   }
  // };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 145,
        p: 2,
        zIndex: 1,
        display: size.height === null ? "none" : "block",
        maxWidth: 425,
        mx: "auto",
      }}
    >
      {topText && (
        <Box
          sx={{
            position: "absolute",
            top: -40,
            right: 0,
            width: "100%",
            color: "primary.darker",
            textAlign: "center",
          }}
        >
          <Typography>{topText}</Typography>
        </Box>
      )}
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-evenly"
        alignItems="center"
        position="relative"
        sx={{ px: "2rem" }}
      >
        {/* <Box>
          <IconButton onClick={handleOpenDialog}>
            <IdeasIcon />
          </IconButton>
        </Box> */}
        <RecordButton />
        {/* <Box>
          <IconButton>
            <CameraIcon />
          </IconButton>
        </Box>
        <Box sx={{ position: "absolute", top: "50%", right: -7, transform: "translateY(-50%)" }}>
          <IconButton onClick={handleOpenDialogClose}>
            <CloseStateIcon />
          </IconButton>
        </Box> */}
      </Stack>

      <IdeasDialog open={openDialog} handleDialog={handleDialog} />

      <Dialog
        open={openDialogClose}
        TransitionComponent={Transition}
        onClose={handleDialogClose}
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
              Do you want to quit?
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ justifyContent: "center" }}>
            <Typography textAlign="center" sx={{ color: "initial", fontSize: 12 }}>
              You did great, keep up the good work as daily routine!
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Stack spacing={1.5} sx={{ mb: 1.5 }}>
            <Button
              onClick={handleDialogClose}
              color="primary"
              variant="contained"
              sx={{ width: 270 }}
            >
              Continue
            </Button>
            <Button onClick={handleClose} color="primary" variant="outlined">
              Quit
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default memo(SidebarMobile);
