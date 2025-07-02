// components/ChatScroll.tsx
import { Box, Stack, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

type Message = {
  id: number;
  text: string;
};

const generateMessages = (count: number, start = 0): Message[] =>
  Array.from({ length: count }, (_, i) => ({
    id: start + i,
    text: `Message #${start + i}`,
  }));

export default function ChatScroll() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  // const boxRef = useRef<HTMLDivElement>(null);
  console.log("messages", messages);

  useEffect(() => {
    // initial load
    setMessages(generateMessages(20, 80));
  }, []);

  const fetchMore = () => {
    console.log("Fetching more messages...");
    setTimeout(() => {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const newMessages = generateMessages(10, messages[0]?.id - 10 || 0);
      setMessages((prev) => [...newMessages, ...prev]); // prepend
      if (newMessages[0].id <= 0) setHasMore(false);
    }, 500);
  };
  console.log("messages", messages);
  return (
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        overflow: "auto",
      }}
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchMore}
        hasMore={hasMore}
        inverse
        height={400}
        scrollThreshold={1}
        scrollableTarget="scrollableDiv"
        style={{ display: "flex", flexDirection: "column-reverse" }}
        loader={
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <CircularProgress size={20} />
          </Box>
        }
      >
        <Stack spacing={2}>
          {messages.map((msg) => (
            <Box key={msg.id} sx={{ background: "#f5f5f5", p: 1, borderRadius: 1 }}>
              {msg.text}
            </Box>
          ))}
        </Stack>
      </InfiniteScroll>
    </div>
  );
}
