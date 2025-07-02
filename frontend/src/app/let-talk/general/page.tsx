"use client";

import { Box, Stack, CircularProgress } from "@mui/material";
import { map } from "lodash";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { chatApi } from "@/app/api/axios/chatApi";
import { LoadingScreen } from "@/components/loading-screen";
import CategoryTopic from "@/components/topic/category-topic";
import { useConversationCustom } from "@/hooks/use-conversation-custom";
import { startPlayer, setAudioPlayerUrl } from "@/redux/features/audioPlayer.slice";
import createNewTopic from "../customization/new-topic/helpers/createNewTopic";

type ConversationCustom = {
  id: string;
  name: string;
  scenario: string;
  systemRole: string;
  userRole: string;
  status: "new" | "chatting" | "ended";
  createdAt: string;
};
export default function CustomizationPage() {
  const router = useRouter();

  const { loading, conversationCustom, handleLoadMore, loadMore } = useConversationCustom({
    type: "general",
  });

  const dispatch = useDispatch();

  const handleNewConversation = (item: ConversationCustom) => {
    const data = {
      topic: item.scenario,
      systemRole: item.systemRole,
      userRole: item.userRole,
      id: item.id,
    };

    dispatch(setAudioPlayerUrl("/audio/noti_start.mp3"));
    dispatch(startPlayer());
    try {
      chatApi.deleteConversation(item.id);
    } catch (error) {
      alert(error);
    }

    const fetchData = async () => {
      const res = await createNewTopic(data);
      if (!res) {
        return;
      }
      router.push(`/chat/topic?id=${res.id}&ref=/let-talk/general`);
    };
    fetchData();
  };
  const handleContinueConversation = (item: ConversationCustom) => {
    dispatch(setAudioPlayerUrl("/audio/noti_start.mp3"));
    dispatch(startPlayer());
    router.push(`/chat/topic?id=${item.id}&ref=/let-talk/general`);
  };

  return (
    <Box height="100%">
      {loading ? (
        <LoadingScreen />
      ) : (
        <Box
          sx={{
            height: "calc(100% - 10px)",
            ".infinite-scroll-component__outerdiv": {
              height: "100%",
            },
            "#scrollableDiv,& .infinite-scroll-component ": {
              "&::-webkit-scrollbar": {
                display: "none",
              },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            },
          }}
        >
          <div
            id="scrollableDiv1"
            style={{
              // overflow: "auto",
              height: "100%",
            }}
          >
            <InfiniteScroll
              dataLength={conversationCustom?.length || 0}
              height="100%"
              next={handleLoadMore || (() => {})}
              hasMore={loadMore || false}
              style={{ display: "flex", flexDirection: "column" }}
              loader={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 25,
                  }}
                >
                  <CircularProgress color="success" size={20} />
                </Box>
              }
              scrollableTarget="scrollableDiv1"
            >
              <Stack spacing={2}>
                {map(conversationCustom, (item: ConversationCustom, index: any) => (
                  <CategoryTopic
                    key={item.id}
                    name={item.scenario}
                    title={item.name}
                    rolePlay={item.userRole}
                    systemRole={item.systemRole}
                    status={item.status}
                    handleContinueConversation={() => handleContinueConversation(item)}
                    handleNewConversation={() => handleNewConversation(item)}
                  />
                ))}
              </Stack>
            </InfiniteScroll>
          </div>
        </Box>
      )}
    </Box>
  );
}
