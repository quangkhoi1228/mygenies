import axiosExternal from "@/lib/axios-external";
import { UserAiType } from "@/redux/types/user-ai-type";

export const agentApi = {
  getAgentConfigList: async () => {
    const url = "/userAiConfig/listConfig";
    return axiosExternal.get(url);
  },
  createAgent: async (data: UserAiType) => {
    const url = "/userAi";
    return axiosExternal.post(url, data);
  },
  getAgentList: async ({ page, count }: { page: number; count: number }) => {
    const url = "/userAi";
    return axiosExternal.get(url, { params: { page, count } });
  },
  getAgentDetail: async (id: number) => {
    const url = `/userAi/${id}`;
    return axiosExternal.get(url);
  },
  updateAgent: async (id: number, data: UserAiType) => {
    const url = `/userAi/${id}`;
    return axiosExternal.patch(url, data);
  },
  getActiveAgent: async () => {
    const url = `/userActiveAi`;
    return axiosExternal.get(url);
  },
  setActiveAgent: async (id: number) => {
    const url = `/userActiveAi`;
    return axiosExternal.post(url, { userAiId: id });
  },
};
