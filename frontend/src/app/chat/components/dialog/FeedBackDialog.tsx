import ChatIcon from "@/assets/icons/ChatIcon";
import QuoteIcon from "@/assets/icons/QuoteIcon";
import TickerIcon from "@/assets/icons/TickerIcon";
import { Box, alpha, Stack, Typography, CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { get } from "lodash";
import * as React from "react";
import { toast } from "sonner";
import { HEADER } from "@/layouts/config-layout";
import { useWindowSize } from "@uidotdev/usehooks";
import MessageAuto from "../message/MessageAuto";
import MessageFeedbackUser from "../message/MessageFeedbackUser";
import MessageStatic from "../message/MessageStatic";
import SidebarRecordOnly from "../SidebarRecordOnly";
import calculateScore from "../../func/calculateScore";
import checkPermissionAudio from "../../func/checkPermissionAudio";
import createMediaAudio from "../../func/createMediaAudio";
import getFeedbackUser from "../../func/getFeedbackUser";
import getTextFromAudio from "../../func/getTextFromAudio";
import { transcribeAudioNormal } from "../../func/transcribeAudioNormal";
import useDataExpectText from "../../hook/useDataExpectText";

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

export default function FeedBackDialog({
  open,
  handleDialog,
  message,
}: {
  open: boolean;
  handleDialog: (status: boolean) => void;
  message: string;
}) {
  const [recordingState, setRecordingState] = React.useState<boolean>(false);

  const [disableRecordButton, setDisableRecordButton] = React.useState<boolean>(false);
  const [textUser, setTextUser] = React.useState<string>("");
  const expect = useDataExpectText(open, message);
  const expectRef = React.useRef<any>(null);
  const [feedbackUser, setFeedbackUser] = React.useState<any>(null);
  const [score, setScore] = React.useState<number | null>(null);

  React.useEffect(() => {
    expectRef.current = expect;
  }, [expect]);
  const stream = React.useRef<MediaStream | null>(null);
  const mediaRecorder = React.useRef<MediaRecorder | null>(null);
  const audioChunks = React.useRef<Blob[]>([]);
  const handleClose = async () => {
    handleDialog(false);
  };

  const handleStartRecord = () => {
    startRecording();
  };

  const handleStopRecord = () => {
    stopRecording();
  };

  const startRecording = async () => {
    const permission = checkPermissionAudio();

    try {
      if (!permission) {
        toast.error("Please allow microphone permission");
        return;
      }
      setRecordingState(true);
      stream.current = await createMediaAudio();
      mediaRecorder.current = new MediaRecorder(stream.current);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.start();
    } catch (error) {
      setRecordingState(false);
    }
  };

  const stopRecording = async () => {
    const permission = checkPermissionAudio();

    try {
      if (!permission) return;
      setTextUser("");
      setFeedbackUser("");
      setRecordingState(false);
      setScore(null);
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        await new Promise<void>((resolve) => {
          if (mediaRecorder.current) {
            mediaRecorder.current.onstop = () => resolve();
            mediaRecorder.current.stop();
          }
        });

        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        if (stream.current) {
          stream.current.getTracks().forEach((track) => track.stop());
        }
        setDisableRecordButton(true);
        const data = await transcribeAudioNormal(audioBlob);
        const text = await getTextFromAudio(data);
        setTextUser(text);
        const feedback = await getFeedbackUser(text, get(expectRef.current, "refinedSentence", ""));
        setFeedbackUser(feedback);
        setScore(calculateScore(feedback.resultExpect));
        setDisableRecordButton(false);
      } else {
        setTimeout(() => {
          handleStopRecord();
        }, 500);
      }
    } catch (error) {
      setRecordingState(true);
      setDisableRecordButton(false);
      setScore(null);
    }
  };
  const size = useWindowSize();
  const heightBoxChat = React.useMemo(
    () => (size.height ? size.height - HEADER.H_MOBILE - 145 - 200 - 30 : 600),
    [size.height]
  );

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleDialog}
      fullScreen
      sx={{ mt: 2 }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.01)",
        },
      }}
      PaperProps={{
        sx: {
          borderTopRightRadius: "10px",
          borderTopLeftRadius: "10px",
        },
      }}
    >
      <DialogContent sx={{ px: 0 }}>
        <Stack spacing={2.4} sx={{ p: 2, mt: 5.5, borderBottom: 1, borderColor: "divider" }}>
          <Stack spacing={1.4} direction="row" alignItems="center">
            <ChatIcon />
            <Typography sx={{ fontSize: 14, color: "primary.main", fontWeight: "bold" }}>
              Feedback
            </Typography>
          </Stack>
          <Box sx={{ display: "flex" }}>
            <Stack
              direction="row"
              spacing={0.9}
              sx={{
                backgroundColor: alpha("#00B8D9", 0.16),
                py: "1px",
                borderRadius: 0.8,
                px: 1,
              }}
            >
              <Typography component="span" sx={{ lineHeight: "14px" }}>
                <QuoteIcon />
              </Typography>
              <Typography sx={{ color: "secondary.main" }}>Your voice</Typography>
            </Stack>
          </Box>
          <Box>
            <Typography
              sx={{
                borderLeft: 1,
                borderColor: "#000",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                color: "info.main",
                pl: 2.5,
              }}
            >
              {message}
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ p: 2.4, display: "flex" }}>
          <Stack
            direction="row"
            spacing={0.8}
            alignItems="center"
            sx={{
              color: "primary.darker",
              backgroundColor: alpha("#22C55E", 0.16),
              py: "1px",
              px: 0.8,
              borderRadius: 0.8,
            }}
          >
            <TickerIcon />
            <Typography>It’s better to say...</Typography>
          </Stack>
        </Box>

        <Stack
          sx={{
            px: 2.4,
            height: heightBoxChat,
            overflow: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
          spacing={2}
        >
          {expect ? (
            <MessageAuto data={{ sentence: get(expect, "refinedSentence", "") }} autoPlay={false} />
          ) : (
            <CircularProgress size="20px" />
          )}
          {textUser && (
            <MessageFeedbackUser
              text={textUser}
              score={score}
              feedback={feedbackUser?.resultExpect}
            />
          )}

          {feedbackUser ? <MessageStatic text={feedbackUser?.feedback} /> : ""}
        </Stack>
      </DialogContent>
      <DialogActions>
        <SidebarRecordOnly
          iconClick={handleClose}
          handleStartRecording={handleStartRecord}
          handleStopRecording={handleStopRecord}
          recordingState={recordingState}
          disable={disableRecordButton}
          topText="(You can try it !)"
        />
      </DialogActions>
    </Dialog>
  );
}
