"use client";

import { LoadingScreen } from "@/components/loading-screen";
import useObjectMemo from "@/hooks/use-object-memo";
import { stopPlayer } from "@/redux/features/audioPlayer.slice";
import {
  setRole,
  setRoleActive,
  setIdConversation,
  setChatFreeTalkStatus,
  setChatFreeTalkContext,
  clearChatFreeTalkMessage,
  setChatFreeTalkCurrentTurn,
  setChattingFreeTalkConversation,
} from "@/redux/features/chatFreeTalk.slice";
import { useAppSelector } from "@/redux/store";
import { get, map, size } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { dashboardApi } from "@/app/api/axios/dashboardApi";
import BoxMessage from "../components/BoxMessage";
import useDataTopic from "../hook/useDataTopic";

function Page() {
  const chatFreeTalkState = useAppSelector((state) => state.chatFreeTalkState);
  const search = useSearchParams();
  const idSearch = search.get("id");
  const router = useRouter();

  const { loading, topic, chatConversation, loadMore, handleLoadMore } = useDataTopic({
    id: idSearch,
  });
  const dispatch = useDispatch();
  const topicCache = useObjectMemo(() => topic, [topic]);
  const chatConversationCache = useObjectMemo(() => chatConversation, [chatConversation]);

  useEffect(() => {
    if (topicCache?.status === "new" && idSearch) {
      chattingTopic(idSearch);
    }
    async function chattingTopic(id: string) {
      try {
        await dashboardApi.setChattingTopicId(id);
      } catch (error) {
        toast.error("Failed to set chatting topic");
      }
    }
  }, [topicCache?.status, dispatch, idSearch]);

  useEffect(() => {
    if (idSearch) {
      dispatch(setRoleActive(true));
      dispatch(setIdConversation(idSearch));
    }
  }, [idSearch, dispatch]);
  useEffect(() => {
    if (topicCache?.status === "ended") {
      dispatch(setChatFreeTalkStatus("end"));
    }

    dispatch(
      setRole({
        topic: topicCache?.scenario,
        systemRole: topicCache?.systemRole,
        userRole: topicCache?.userRole,
      })
    );
    dispatch(
      setChatFreeTalkContext({
        topic: topicCache?.scenario,
        systemRole: topicCache?.systemRole,
        userRole: topicCache?.userRole,
      })
    );
  }, [topicCache, dispatch]);

  const hasInitialized = useRef(false);
  const turn = get(chatConversationCache, `[${size(chatConversationCache) - 1}].role`, null);
  useEffect(() => {
    if (hasInitialized.current) return;
    if (chatConversationCache === undefined) return;
    hasInitialized.current = true;

    if (topicCache?.id && !loading) {
      const nextTurn = turn === "system" ? "user" : "system";
      dispatch(setChatFreeTalkCurrentTurn(nextTurn));
    }
  }, [chatConversationCache, topicCache, dispatch, loading, turn]);
  useEffect(() => {
    const listMessage = map(chatConversationCache, (item) => ({
      role: item.role,
      sentence: item.sentence,
      order: item.order,
      id: item.id,
    }));
    dispatch(setChattingFreeTalkConversation(listMessage));
  }, [chatConversationCache, dispatch]);

  useEffect(() => {
    dispatch(setChatFreeTalkStatus("start"));
    return () => {
      dispatch(clearChatFreeTalkMessage());
      dispatch(setRoleActive(false));
      dispatch(stopPlayer());
    };
  }, [dispatch]);
  if (!idSearch) {
    router.push("/");
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BoxMessage
      topic={topicCache?.name}
      systemRole={topicCache?.systemRole}
      userRole={topicCache?.userRole}
      chatConversation={chatFreeTalkState.chattingConversation}
      hints={chatFreeTalkState.hintSentences}
      roleCurrent={
        chatFreeTalkState.chattingConversation[chatFreeTalkState.chattingConversation.length - 1]
          ?.role
      }
      loadMore={loadMore}
      handleLoadMore={handleLoadMore}
    />
  );
}
export default memo(Page);
