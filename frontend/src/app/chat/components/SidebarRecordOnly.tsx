import { Box, Stack, IconButton, Typography } from "@mui/material";
import { useWindowSize } from "@uidotdev/usehooks";
import CloseDialog from "@/assets/icons/CloseDialog";
import RecordButtonProps from "./button/RecordButtonProps";

export default function SidebarRecordOnly({
  iconClick,
  handleStartRecording,
  handleStopRecording,
  recordingState,
  disable,
  topText,
}: {
  iconClick: () => void;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  recordingState: boolean;
  disable: boolean;
  topText?: string;
}) {
  const size = useWindowSize();

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
      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
        <RecordButtonProps
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
          recordingState={recordingState}
          disable={disable}
        />
      </Stack>
      <Box
        sx={{
          position: "absolute",
          height: "100%",
          top: 0,
          right: 18,
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton onClick={iconClick}>
          <CloseDialog />
        </IconButton>
      </Box>
    </Box>
  );
}
