import { dashboardApi } from "@/app/api/axios/dashboardApi";
import { useState, useEffect } from "react";

export const useConversationCustom = ({ type }: { type: string }) => {
  const [loading, setLoading] = useState(false);
  const [conversationCustom, setConversationCustom] = useState<any[]>([]);
  const [loadMore, setLoadMore] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await getConversationCustom({ count: 10, page: 1, type });
      setConversationCustom(data);
      setLoading(false);
      if (!data || data?.length === 0 || data?.length < 10) {
        setLoadMore(false);
      }
    };
    fetchData();
  }, [type]);

  const handleLoadMore = async () => {
    console.log("handleLoadMore");
    const nextPage = Math.ceil(conversationCustom.length / 10) + 1;
    try {
      const { data } = await getConversationCustom({ count: 10, page: nextPage, type });

      setConversationCustom((prev) => [...prev, ...data]);

      if (data?.length === 0 || data?.length < 10) {
        setLoadMore(false);
      }
    } catch (error) {
      setLoadMore(false); // Ngắt load nếu có lỗi
    }
  };
  return { loading, conversationCustom, handleLoadMore, loadMore };
};

async function getConversationCustom({
  count,
  page,
  type,
}: {
  count: number;
  page: number;
  type: string;
}) {
  try {
    const data = await dashboardApi.getConversationPagination({ count, page, type });
    return data.data;
  } catch (error) {
    console.error("error", error);
    return [];
  }
}
