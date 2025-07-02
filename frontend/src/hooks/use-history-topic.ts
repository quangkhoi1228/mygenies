import { useState, useEffect } from "react";

export default function useHistoryTopic() {
  const [historyTopic, setHistoryTopic] = useState<any[]>();
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryTopic = async () => {};
    fetchHistoryTopic();
  }, []);

  return { historyTopic };
}
