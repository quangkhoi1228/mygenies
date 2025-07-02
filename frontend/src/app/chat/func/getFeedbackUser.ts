import { chatApi } from "@/app/api/axios/chatApi";

export default async function getFeedbackUser(userSentence: string, expectedSentence: string) {
  try {
    const result = await chatApi.getFeedbackText(userSentence, expectedSentence);
    const { data } = result;
    return data;
  } catch (error) {
    return null;
  }
}
