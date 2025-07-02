"use client";

import { sample } from "lodash";
import { memo, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { stopPlayer, setAudioPlayerUrl } from "@/redux/features/audioPlayer.slice";
import {
  setRoleActive,
  addFreeTalkNewMessage,
  setChatFreeTalkStatus,
  clearChatFreeTalkMessage,
  setFreeTalkHintSentences,
  setChatFreeTalkCurrentTurn,
  setChattingFreeTalkConversation,
} from "@/redux/features/chatFreeTalk.slice";
import { RootState } from "@/redux/features/root.reducer";
import { useAppSelector } from "@/redux/store";
import BoxMessage from "../components/BoxMessage";

// export const metadata = {
//   title: `Let's talk`,
// };

function FreeTalkPage() {
  const freeTalkState = useAppSelector((state: RootState) => state.chatFreeTalkState);
  const dispatch = useDispatch();

  const roleCurrent = useMemo(
    () => freeTalkState.chattingConversation[freeTalkState.chattingConversation.length - 1]?.role,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [freeTalkState.chattingConversation[freeTalkState.chattingConversation.length - 1]?.role]
  );
  const hints = useMemo(
    () => freeTalkState.hintSentences,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [freeTalkState.hintSentences]
  );

  const chatConversation = useMemo(
    () => freeTalkState.chattingConversation,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [freeTalkState.chattingConversation?.length]
  );

  useEffect(() => {
    dispatch(setChattingFreeTalkConversation([]));
  }, [dispatch]);
  useEffect(() => {
    dispatch(setChatFreeTalkStatus("start"));
    dispatch(setRoleActive(false));
    dispatch(setChatFreeTalkCurrentTurn("user"));
    return () => {
      dispatch(clearChatFreeTalkMessage());
      dispatch(setAudioPlayerUrl(""));
      dispatch(stopPlayer());
    };
  }, [dispatch]);
  const { sentences } = useAppSelector((state: RootState) => state.sentenceHelloState);
  useEffect(() => {
    const randomSentence = sample(sentences) || {
      sentence: "Hi! I'm ready when you are. Let’s have some fun with English!",
      hint: "Thank for asking, how are you today?",
    };
    if (randomSentence.sentence) {
      dispatch(
        addFreeTalkNewMessage([
          {
            sentense: randomSentence.sentence,
            role: "system",
          },
        ])
      );
      dispatch(setFreeTalkHintSentences([randomSentence.hint]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentences.length]);

  return <BoxMessage chatConversation={chatConversation} hints={hints} roleCurrent={roleCurrent} />;
}
export default memo(FreeTalkPage);
