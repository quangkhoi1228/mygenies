import { chatApi } from "@/app/api/axios/chatApi";
import { dashboardApi } from "@/app/api/axios/dashboardApi";

type GetInfoTopic = {
  systemRole: string;
  userRole: string;
  topic: string;
};
export default async function createNewTopic(inputParams: GetInfoTopic) {
  const res = await getTopic(inputParams);
  if (!res) {
    return null;
  }
  const responseTopic = await setNewTopicCustomization(res);
  if (!responseTopic) {
    return null;
  }
  return responseTopic;
}
const setNewTopicCustomization = async (params: any) => {
  try {
    const { data } = await dashboardApi.setNewTopicCustomization(
      params.context.topic,
      params.title,
      params.context.userRole,
      params.context.systemRole
    );
    return data;
  } catch (error) {
    return null;
  }
};
const getTopic = async (inputParams: GetInfoTopic) => {
  try {
    const { systemRole, userRole, topic } = inputParams;

    const params = {
      quantity: 20,
      chatHistory: [],
      roleBased: true,
      topic,
      systemRole,
      userRole,
      hintQuantity: 5,
    };
    const { data } = await chatApi.getContext(params);
    return data;
  } catch (error) {
    return null;
  }
};
