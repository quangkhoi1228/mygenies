import { uniqueId } from "lodash";
import { chatApi } from "@/app/api/axios/chatApi";

export async function transcribeAudioNormal(blob: Blob) {
  try {
    // 1. Gọi API lấy upload URL
    // const postUrl = await convexClient.mutation(api.chatMessages.generateUploadUrl, {});

    // 2. Upload file
    const file = new File([blob], "audio.wav", { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await chatApi.uploadAudio(formData);
    if (!data.url) throw new Error("Upload failed");

    return { url: data.url, name: uniqueId() };
  } catch (error) {
    console.error("Error in transcribeAudioNormal:", error);
    throw error;
  }
}
