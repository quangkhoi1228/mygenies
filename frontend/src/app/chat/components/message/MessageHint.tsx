import useTextToSpeedAudio from "@/app/chat/hook/useTextToSpeedAudio";
import SpeakIcon from "@/assets/icons/SpeakIcon";
import { startPlayer, setAudioPlayerUrl } from "@/redux/features/audioPlayer.slice";
import { Box, Stack, IconButton, CircularProgress } from "@mui/material";
import React, { memo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import useTextTranslateToVN from "../../hook/useTextTranslateToVN";

function MessageHint({ data }: { data?: string }) {
  const elemRef = React.useRef<HTMLDivElement>(null);
  // const audioRef = React.useRef<HTMLAudioElement>();
  const [showSpeech, setShowSpeech] = useState<boolean>(false);
  const textTranslate = useTextTranslateToVN(true, data);
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (elemRef.current) {
      elemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [textTranslate]);
  const audioText = useTextToSpeedAudio(data || "");
  useEffect(() => {
    if (audioText) {
      setShowSpeech(true);
    }
  }, [audioText]);
  const handlePlayAudio = () => {
    if (audioText) {
      dispatch(setAudioPlayerUrl(audioText));
      dispatch(startPlayer());
    }
  };
  return (
    data && (
      <Stack ref={elemRef} direction="row" justifyContent="end">
        <Box maxWidth="26.33%">
          <Stack direction="row" spacing={1.2} alignItems="end" height="100%" justifyContent="end">
            {showSpeech ? (
              <Box>
                <IconButton sx={{ p: 0, mr: 1.8 }} onClick={handlePlayAudio}>
                  <SpeakIcon />
                </IconButton>
              </Box>
            ) : (
              ""
            )}
          </Stack>
        </Box>
        <Box maxWidth="73.67%">
          <Box
            sx={{
              borderRadius: "10px",
              borderBottomRightRadius: "0px",
              p: 1.2,
              backgroundColor: "rgba(255, 171, 0, 0.48)",
              color: "rgba(99, 115, 129, 1)",
              fontSize: 14,
              lineHeight: "22px",
            }}
          >
            {data || <CircularProgress color="success" size="small" />}
            <br />
            {textTranslate ? `(${textTranslate})` : <CircularProgress size="15px" />}
          </Box>
        </Box>
      </Stack>
    )
  );
}
export default memo(MessageHint);
