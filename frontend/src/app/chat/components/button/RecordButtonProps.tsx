import LoadingRecording from "@/assets/icons/LoadingRecording";
import RecordingIcon from "@/assets/icons/RecordingIcon";
import { RootState } from "@/redux/store";
import { Box, IconButton, Typography } from "@mui/material";
import { useCallback } from "react";
import { useSelector } from "react-redux";

export default function RecordButtonProps({
  handleStartRecording,
  handleStopRecording,
  recordingState,
  disable,
}: {
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  recordingState: boolean;
  disable: boolean;
}) {
  const { isTouch } = useSelector((state: RootState) => state.deviceState);

  const handleTouchStart = useCallback(
    (e: any) => {
      e.preventDefault();
      if (isTouch) {
        handleStartRecording();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTouch]
  );
  const handleTouchEnd = useCallback(
    (e: any) => {
      e.preventDefault();
      if (isTouch) {
        handleStopRecording();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTouch]
  );
  const handleMouseUp = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!isTouch) {
        handleStopRecording();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTouch]
  );
  const handleMouseDown = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!isTouch) {
        handleStartRecording();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTouch]
  );

  // eslint-disable-next-line no-nested-ternary
  const colorRecord = !disable ? (recordingState ? "#919EAB" : "#00A76F") : "#919EAB";

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        onClick={(e) => e.preventDefault()}
        onDoubleClick={(e) => e.preventDefault()}
        onFocus={(e) => e.preventDefault()}
        aria-disabled
        disabled={disable}
        disableRipple
        disableFocusRipple
        disableTouchRipple
        sx={{
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          touchAction: "manipulation",
        }}
        draggable={false}
      >
        <RecordingIcon color={colorRecord} />
      </IconButton>
      {disable && (
        <Typography sx={{ position: "absolute", bottom: 0, left: 10, right: 0, top: 20, p: 1 }}>
          <LoadingRecording />
        </Typography>
      )}
      <Typography
        sx={{
          position: "absolute",
          bottom: -16,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#00A76F",
          fontSize: 14,
        }}
      >
        {recordingState ? " Recording..." : ""}
      </Typography>
    </Box>
  );
}
