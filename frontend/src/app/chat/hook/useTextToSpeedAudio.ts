import { chatApi } from "@/app/api/axios/chatApi";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function useTextToSpeedAudio(text: string) {
  const [audio, setAudio] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!text) {
        toast.error("Vui lòng nhập đoạn text cần đọc");
      } else {
        const dataAudio = await getAudioWithText(text);
        setAudio(dataAudio);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return audio;
}

async function getAudioWithText(text: string) {
  try {
    const { data } = await chatApi.generateSpeech(text);
    const ttsRes: {
      name: string;
      url: string;
    } = data;
    return ttsRes.url;
  } catch (error) {
    console.error(error);
    return null;
  }
}
