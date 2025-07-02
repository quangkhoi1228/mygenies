import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import { useWindowSize } from "@uidotdev/usehooks";
import { memo, useRef, useMemo, useState, useEffect, useCallback } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import { roleType } from "@/redux/features/chatMessages.slice";
import { ChatFreeTalkType } from "@/redux/features/chatFreeTalk.slice";
import { HEADER } from "@/layouts/config-layout";
import HintMiniIcon from "./message/HintMiniIcon";
import MessageAuto from "./message/MessageAuto";
import MessageHint from "./message/MessageHint";
import MessageUser from "./message/MessageUser";

function BoxMessage({
  chatConversation,
  roleCurrent,
  hints,
  topic,
  systemRole,
  userRole,
  handleLoadMore,
  loadMore,
}: {
  topic?: string;
  systemRole?: string;
  userRole?: string;
  chatConversation: ChatFreeTalkType[];
  hints: string[];
  roleCurrent: roleType;
  handleLoadMore?: () => void;
  loadMore?: boolean;
}) {
  const size = useWindowSize();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [listMessage, setListMessage] = useState<ChatFreeTalkType[]>([]);
  useEffect(() => {
    setListMessage(chatConversation);
  }, [chatConversation]);

  const heightBoxChat = useMemo(
    () => (size.height ? size.height - HEADER.H_MOBILE - 125 : 600),
    [size.height]
  );
  const [hint, setHint] = useState(false);
  const hintIconRef = useRef<HTMLDivElement>(null);

  const handleChangeHint = useCallback(() => {
    setHint((prev) => !prev);
  }, []);

  useEffect(() => {
    setHint(false);
  }, [roleCurrent]);
  useEffect(() => {
    if (hintIconRef.current) {
      hintIconRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [hints]);

  return (
    <Box sx={{ overflow: "hidden", mt: 0.4 }}>
      {topic && (
        <Stack sx={{ pb: 3 }}>
          <Typography fontWeight={700} color="primary.darker">
            Scenerio: {topic}
          </Typography>
          <Typography color="primary.darker">
            Doku is {systemRole} and you are {userRole}{" "}
          </Typography>
        </Stack>
      )}

      <Box
        sx={{
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
          id="scrollableDiv"
          // ref={scrollRef}
          style={{
            height: heightBoxChat - (topic ? 70 : 0),
            overflow: "auto",
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          <InfiniteScroll
            dataLength={listMessage.length}
            height={heightBoxChat - (topic ? 70 : 0)}
            next={handleLoadMore || (() => {})}
            hasMore={loadMore || false}
            inverse
            style={{
              ...(listMessage.length >= 10 && { display: "flex", flexDirection: "column-reverse" }),
            }}
            loader={
              <Box
                sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 25 }}
              >
                <CircularProgress color="success" size={20} />
              </Box>
            }
            scrollableTarget="scrollableDiv"
          >
            <Stack spacing={1.8} ref={scrollRef}>
              {listMessage.map((item, index) => {
                const lastIndex = listMessage.length - 1 === index;

                if (item.role === "user") {
                  return <MessageUser key={`${item.id}`} data={item} />;
                }
                if (item.role === "system") {
                  return <MessageAuto key={`${item.id}`} data={item} autoPlay={lastIndex} />;
                }
                return "";
              })}

              {roleCurrent === "system" ? (
                <>
                  {hint ? (
                    <MessageHint data={hints[0]} />
                  ) : (
                    <Typography ref={hintIconRef}>
                      <HintMiniIcon handleChangeHint={handleChangeHint} data={hints[0]} />
                    </Typography>
                  )}
                </>
              ) : (
                ""
              )}
            </Stack>
          </InfiniteScroll>
        </div>
      </Box>
    </Box>
  );
}
export default memo(BoxMessage);
