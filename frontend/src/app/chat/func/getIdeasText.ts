import { chatApi } from "@/app/api/axios/chatApi";

export default async function getIdeasText(text: string) {
  try {
    const { data } = await chatApi.getIdeas(text);
    return data;
  } catch (error) {
    return null;
  }
}
