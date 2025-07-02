"use client";

import { Box, Stack, IconButton, CircularProgress } from "@mui/material";
import React, { memo, useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import useTextToSpeedAudio from "@/app/chat/hook/useTextToSpeedAudio";
import useTextTranslateToVN from "@/app/chat/hook/useTextTranslateToVN";
import SpeakIcon from "@/assets/icons/SpeakIcon";
import TranslateIcon from "@/assets/icons/TranslateIcon";
import { startPlayer, setAudioPlayerUrl } from "@/redux/features/audioPlayer.slice";
import ChatAvatar from "../ChatAvatar";

function MessageAuto({ data, autoPlay = true }: { data?: any; autoPlay?: boolean }) {
  const dispatch = useDispatch();
  const elemRef = React.useRef<HTMLDivElement>(null);
  // const audioRef = React.useRef<HTMLAudioElement>();
  const [showSpeech, setShowSpeech] = useState<boolean>(false);
  const [showTranslate, setShowTranslate] = useState<boolean>(false);
  const audioText = useTextToSpeedAudio(data?.sentence);
  const textTranslate = useTextTranslateToVN(showTranslate, data?.sentence);

  const handlePlayAudio = () => {
    if (audioText) {
      dispatch(setAudioPlayerUrl(audioText));
      dispatch(startPlayer());
    }
  };

  const handleClickTranslate = () => {
    setShowTranslate(true);
  };

  useEffect(() => {
    if (audioText) {
      setShowSpeech(true);
      if (autoPlay) {
        dispatch(setAudioPlayerUrl(audioText));
        dispatch(startPlayer());
      }
    }
  }, [autoPlay, audioText, dispatch]);

  const textTranslateCache = useMemo(() => textTranslate, [textTranslate]);
  React.useEffect(() => {
    if (elemRef.current) {
      elemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [textTranslateCache]);

  return (
    <Stack ref={elemRef} direction="row" sx={{ mb: 2, scrollMargin: 20 }}>
      <Box>
        <ChatAvatar />
      </Box>
      <Box maxWidth="73.67%" sx={{ position: "relative" }}>
        <Box
          sx={{
            borderRadius: "10px",
            borderBottomLeftRadius: "0px",
            p: 1.2,
            backgroundColor: "rgba(145, 158, 171, 0.2)",
            color: "rgba(0, 75, 80, 1)",
            fontSize: 14,
            lineHeight: "22px",
          }}
        >
          {data?.sentence}
          <br />
          {showTranslate ? (
            <>{textTranslate ? `(${textTranslate})` : <CircularProgress size="15px" />}</>
          ) : (
            ""
          )}
        </Box>
        <Stack
          direction="row"
          spacing={1.2}
          alignItems="end"
          height="100%"
          sx={{ position: "absolute", bottom: -11, right: 13 }}
        >
          <Box sx={{ ml: 1.5 }}>
            <IconButton sx={{ p: 0, background: "#fff" }} onClick={handleClickTranslate}>
              <TranslateIcon />
            </IconButton>
          </Box>

          {showSpeech ? (
            <Box>
              <IconButton sx={{ p: 0, background: "#fff !important" }} onClick={handlePlayAudio}>
                <SpeakIcon />
              </IconButton>
            </Box>
          ) : (
            ""
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
export default memo(MessageAuto);
