/* eslint-disable @typescript-eslint/no-shadow */
import { Box, Stack, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import scoreEachWord from "@/app/chat/func/scoreEachWord";
import HeartIcon from "@/assets/icons/HeartIcon";

type Analysis = Record<string, number>;

interface WordData {
  word: string;
  analysis: Analysis;
}

interface ScoredWord {
  word: string;
  score: number; // điểm trên thang 100
}
export default function MessageFeedbackUser({
  text,
  score,
  feedback,
}: {
  text: string;
  score?: number | null;
  feedback?: WordData[];
}) {
  const [textScore, setTextScore] = useState(score);
  const [listWord, setListWord] = useState<ScoredWord[]>([]);

  const elemRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listWordText = scoreEachWord(feedback || []);
    setListWord(listWordText);
  }, [feedback]);

  useEffect(() => {
    setTextScore(score);
  }, [score]);

  React.useEffect(() => {
    if (elemRef.current) {
      elemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  });
  return (
    <Stack direction="row" justifyContent="end" ref={elemRef}>
      <Box maxWidth="26.33%">{}</Box>
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
            position: "relative",
          }}
        >
          <Typography>{text}</Typography>

          {typeof textScore === "number" && textScore > 80 ? (
            <Box sx={{ position: "absolute", right: 14, bottom: -22, zIndex: 100 }}>
              <HeartIcon />
            </Box>
          ) : (
            ""
          )}
        </Box>
      </Box>
    </Stack>
  );
}
