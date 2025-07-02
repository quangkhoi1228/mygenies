import QuoteIcon from "@/assets/icons/QuoteIcon";
import TickerIcon from "@/assets/icons/TickerIcon";
import { HEADER } from "@/layouts/config-layout";
import { audioRecordingActions } from "@/redux/features/audioRecording.slice";
import { Box, alpha, Stack, Button, TextField, Typography, CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useWindowSize } from "@uidotdev/usehooks";
import * as React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import SidebarRecordOnly from "../SidebarRecordOnly";
import checkPermissionAudio from "../../func/checkPermissionAudio";
import createMediaAudio from "../../func/createMediaAudio";
import getIdeasText from "../../func/getIdeasText";
import getTextFromAudio from "../../func/getTextFromAudio";
import { transcribeAudioNormal } from "../../func/transcribeAudioNormal";

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

export default function IdeasDialog({
  open,
  handleDialog,
}: {
  open: boolean;
  handleDialog: (status: boolean) => void;
}) {
  const dispatch = useDispatch();
  const [recordingState, setRecordingState] = React.useState<boolean>(false);
  const [disableRecordButton, setDisableRecordButton] = React.useState<boolean>(false);
  const [modeIdeasRecord, setModeIdeasRecord] = React.useState<boolean>(true);
  const [textIdeas, setTextIdeas] = React.useState<string>("");
  const [listIdeas, setListIdeas] = React.useState<string[]>([]);
  const modeIdeasRecordRef = React.useRef<boolean>(true);

  const [loadingButton, setLoadingButton] = React.useState<boolean>(false);

  React.useEffect(() => {
    setRecordingState(false);
    setDisableRecordButton(false);
    setModeIdeasRecord(true);
    setTextIdeas("");
    setListIdeas([]);
    setLoadingButton(false);
  }, [open]);
  React.useEffect(() => {
    modeIdeasRecordRef.current = modeIdeasRecord;
  }, [modeIdeasRecord]);

  // Audio define
  const stream = React.useRef<MediaStream | null>(null);
  const mediaRecorder = React.useRef<MediaRecorder | null>(null);
  const audioChunks = React.useRef<Blob[]>([]);
  //
  const handleOnSubmitIdeas = () => {
    const fetchIdeas = async () => {
      if (textIdeas === "") {
        toast.error("Please write your ideas");
        return;
      }
      setListIdeas([]);
      setLoadingButton(true);
      setModeIdeasRecord(false);
      setDisableRecordButton(true);

      const { generatedSentences } = await getIdeasText(textIdeas);
      setLoadingButton(false);
      setListIdeas(generatedSentences);
      setDisableRecordButton(false);
    };
    fetchIdeas();
  };
  const handleClose = async () => {
    handleDialog(false);
  };

  const handleStartRecord = () => {
    if (modeIdeasRecordRef.current) {
      startRecording();
    } else {
      setRecordingState(true);
      dispatch(audioRecordingActions.startRecording());
    }
  };

  const handleOnchangeTextIdeas = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextIdeas(e.target.value);
  };
  const handleStopRecord = () => {
    if (modeIdeasRecordRef.current) {
      stopRecording();
    } else {
      setRecordingState(false);
      setDisableRecordButton(true);
      handleDialog(false);
      dispatch(audioRecordingActions.stopRecording());
    }
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
      setListIdeas([]);
      setLoadingButton(true);
      setRecordingState(true);
      setModeIdeasRecord(false);

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
        if (text === "") {
          toast.error("Please write your ideas");
        } else {
          const { generatedSentences } = await getIdeasText(text);
          setListIdeas(generatedSentences);
        }
        setRecordingState(false);
        setLoadingButton(false);
        setTextIdeas(text);
        setDisableRecordButton(false);
      } else {
        setTimeout(() => {
          handleStopRecord();
        }, 500);
      }
    } catch (error) {
      setModeIdeasRecord(true);
      setRecordingState(false);
      setDisableRecordButton(false);
    }
  };
  const size = useWindowSize();
  const heightBoxChat = React.useMemo(
    () => (size.height ? size.height - HEADER.H_MOBILE - 145 - 220 - 30 : 600),
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
        <Stack spacing={1.5} sx={{ p: 2, display: "flex", pt: 5.8, pb: 1.2 }}>
          <Box display="flex">
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
              <Typography>Generate some ideas</Typography>
            </Stack>
          </Box>
          <Typography color="primary.darker" sx={{ mb: 0.5, mr: 2.5 }}>
            You can write your ideas by English or Vietnamese, Doku will help you generate the idea.
            Or you can use some keywords suggested.
          </Typography>
          <Box>
            <Stack direction="row" spacing={0} alignItems="center">
              <TextField
                multiline
                minRows={3}
                maxRows={3}
                value={textIdeas}
                onChange={handleOnchangeTextIdeas}
                variant="outlined"
                placeholder="Write your ideas here..."
                disabled={loadingButton}
                InputProps={{
                  style: {
                    backgroundColor: "#919EAB14",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#0f5c5c",
                    display: "flex", // 👈 thêm
                    alignItems: "center",
                  },
                }}
                sx={{
                  width: 247,
                  minWidth: 247,
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "primary.darker",
                    opacity: 1,
                  },
                }}
              />
              <Button
                size="small"
                variant="contained"
                color="primary"
                sx={{
                  lineHeight: "28px",
                  transition: "all 0.3s ease-in-out",
                  ml: loadingButton ? "5px" : "18px",
                  maxWidth: "100%",
                }}
                onClick={handleOnSubmitIdeas}
                disabled={loadingButton}
                startIcon={loadingButton ? <CircularProgress color="success" size={12} /> : ""}
              >
                Generate
              </Button>
            </Stack>
          </Box>
        </Stack>
        <Stack
          sx={{
            px: 2.4,
          }}
          spacing={1}
        >
          {listIdeas.length > 0 ? (
            <Box sx={{ display: "flex" }}>
              <Stack
                direction="row"
                spacing={0.9}
                sx={{
                  backgroundColor: alpha("#22C55E", 0.16),
                  py: "1px",
                  borderRadius: 0.8,
                  px: 1,
                }}
              >
                <Typography component="span" sx={{ lineHeight: "14px" }}>
                  <QuoteIcon color="#118D57" />
                </Typography>
                <Typography sx={{ color: "primary.darker" }}>
                  Some sentences like native speaker
                </Typography>
              </Stack>
            </Box>
          ) : (
            ""
          )}

          <Stack spacing={2.4} sx={{ height: heightBoxChat, overflowY: "auto" }}>
            {listIdeas.map((item, index) => (
              <Stack key={item} direction="row" spacing={0.5}>
                <Typography color="primary.darker">{index + 1}.</Typography>
                <Typography color="primary.darker">{item}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <SidebarRecordOnly
          iconClick={handleClose}
          handleStartRecording={handleStartRecord}
          handleStopRecording={handleStopRecord}
          recordingState={recordingState}
          disable={disableRecordButton}
          topText={
            // eslint-disable-next-line no-nested-ternary
            modeIdeasRecord
              ? "(You can say your idea - Bạn có thể nói ý tưởng)"
              : disableRecordButton
                ? ""
                : "(You can try it !)"
          }
        />
      </DialogActions>
    </Dialog>
  );
}
