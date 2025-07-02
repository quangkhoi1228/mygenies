"use client";

import RecordingIcon from "@/assets/icons/RecordingIcon";
import { stopRecording, startRecording } from "@/redux/features/audioRecording.slice";
import { RootState, useAppSelector } from "@/redux/store";
import { Box, IconButton, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const LoadingRecording = dynamic(() => import("@/assets/icons/LoadingRecording"), { ssr: false });

export default function RecordButton() {
  const dispatch = useDispatch();
  const recordingState = useSelector((state: RootState) => state.audioRecordingState);
  const { isTouch } = useSelector((state: RootState) => state.deviceState);
  const { status, isChatProcessing, currentTurn } = useAppSelector(
    (state: RootState) => state.chatFreeTalkState
  );

  const handleStartRecording = useCallback(
    (e: any) => {
      //   e.preventDefault();
      dispatch(startRecording());
    },
    [dispatch]
  );

  const handleStopRecording = useCallback(
    (e: any) => {
      //   e.preventDefault();

      dispatch(stopRecording());
    },
    [dispatch]
  );
  const handleTouchStart = useCallback(
    (e: any) => {
      e.preventDefault();
      if (isTouch) {
        handleStartRecording(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTouch]
  );
  const handleTouchEnd = useCallback(
    (e: any) => {
      e.preventDefault();
      if (isTouch) {
        handleStopRecording(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTouch]
  );
  const handleMouseUp = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!isTouch) {
        handleStopRecording(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTouch]
  );
  const handleMouseDown = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!isTouch) {
        handleStartRecording(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTouch]
  );

  const isEndStatus = status === "end";
  const isSystemTurn = currentTurn === "system";
  const disableRecord = isEndStatus || isChatProcessing || isSystemTurn;

  // eslint-disable-next-line no-nested-ternary
  const colorRecord = !disableRecord
    ? recordingState?.isRecording
      ? "#919EAB"
      : "#00A76F"
    : "#919EAB";

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
        // onDoubleClick={(e) => e.preventDefault()}
        // onFocus={(e) => e.preventDefault()}
        aria-disabled
        disabled={disableRecord}
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
      {disableRecord && status !== "end" && (
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
        {recordingState?.isRecording ? " Recording..." : ""}
      </Typography>
    </Box>
  );
}
