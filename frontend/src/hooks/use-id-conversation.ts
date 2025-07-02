import { dashboardApi } from "@/app/api/axios/dashboardApi";
import { useState, useEffect } from "react";

type ConversationCustom = {
  id: string;
  status: "new" | "chatting" | "ended";
  name: string;
  topic: string;
  systemRole: string;
  userRole: string;
};
export const useIdConversation = (id: string) => {
  const [loading, setLoading] = useState(false);
  const [conversationCustom, setConversationCustom] = useState<ConversationCustom>();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getConversationID(id);
      setConversationCustom(data);
      setLoading(false);
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  return { loading, conversationCustom };
};

async function getConversationID(id: string) {
  try {
    const data = await dashboardApi.getConversationCustom(id);
    return data.data;
  } catch (error) {
    console.error("error", error);
    return [];
  }
}
