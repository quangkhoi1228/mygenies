import { chatApi } from "@/app/api/axios/chatApi";

export default async function getTextFromAudio(audioUpload: any) {
  try {
    const { url } = audioUpload;
    const { data } = await chatApi.translateAudioToText(url);
    const { transcription } = data;
    return transcription;
  } catch (error) {
    return error;
  }
}
