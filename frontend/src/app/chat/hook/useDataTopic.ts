import { size, reverse } from "lodash";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { dashboardApi } from "@/app/api/axios/dashboardApi";
import { chatApi } from "@/app/api/axios/chatApi";

const offset = 10;
export default function useDataTopic({ id }: { id: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState(null);
  const [chatConversation, setChatConversation] = useState<any[] | undefined>(undefined);
  const [loadMore, setLoadMore] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!id) {
        setLoading(false);
        toast.error("Can't not find topic");
        router.push("/");
        return;
      }
      const resTopic = await getTopic(id);
      setTopic(resTopic);
      const { data } = await getHistoryTopic(id, offset, 1);
      setChatConversation(reverse(data));
      setLoading(false);
      if (size(data) < 10) {
        setLoadMore(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleLoadMore = () => {
    const fetchData = async () => {
      const page = Math.ceil(size(chatConversation) / offset) + 1;
      if (id) {
        const { data }: { data: [] } = await getHistoryTopic(id, offset, page);
        if (data) {
          setChatConversation((prev) => [...reverse(data), ...(prev || [])]);
          if (size(data) < 10) {
            setLoadMore(false);
          }
        }
      }
    };
    fetchData();
  };

  return { chatConversation, loading, topic, loadMore, setLoadMore, handleLoadMore };
}
const getTopic = async (id: string) => {
  try {
    const { data } = await dashboardApi.getConversationCustom(id);
    return data;
  } catch (error) {
    return null;
  }
};

const getHistoryTopic = async (id: string, count: number, page: number) => {
  try {
    const params = `count=${count}&filter={"userConversationTopicId":{"operator":"=","value":${id}}}&sort={"order":"desc"}&page=${page}`;
    const { data } = await chatApi.getChatFreeTalkHistory(params);
    return data;
  } catch (error) {
    return [];
  }
};
