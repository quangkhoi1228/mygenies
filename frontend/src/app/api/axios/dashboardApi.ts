import axiosExternal from "@/lib/axios-external";

export const dashboardApi = {
  get50SentencesHello: async () => {
    const url = `/defaultSentence`;
    const params = {
      count: 50,
      filter: { type: { operator: "=", value: "hello" } },
      sort: { id: "desc" },
      page: 1,
    };
    return axiosExternal.get(url, { params });
  },
  setNewTopicCustomization: async (
    name: string,
    scenario: string,
    userRole: string,
    systemRole: string
  ) => {
    const url = `/userConversationTopic`;
    const params = {
      name,
      scenario,
      userRole,
      systemRole,
      status: "chatting",
    };
    return axiosExternal.post(url, params);
  },
  setEndTopicCustomization: async (id: string) => {
    const url = `/userConversationTopic/${id}`;
    const params = {
      status: "ended",
    };
    return axiosExternal.patch(url, params);
  },
  setChattingTopicId: async (id: string) => {
    const url = `/userConversationTopic/${id}`;
    const params = {
      status: "chatting",
    };
    return axiosExternal.patch(url, params);
  },
  addMessageToConversation: async (
    userConversationTopicId: number,
    sentence: string,
    role: string,
    order: number
  ) => {
    const url = `/userConversationTopicHistory`;
    const params = {
      userConversationTopicId,
      sentence,
      role,
      order,
    };
    return axiosExternal.post(url, params);
  },
  getCurrentUser: async () => {
    const url = `/user/currentUser`;
    return axiosExternal.get(url);
  },
  getConversationCustom: async (id?: string) => {
    const url = id ? `/userConversationTopic/${id}` : `/userConversationTopic`;
    return axiosExternal.get(url);
  },
  getConversationPagination: async ({
    count,
    page,
    type,
  }: {
    count: number;
    page: number;
    type: string;
  }) => {
    const url = `/userConversationTopic`;
    const params = `?count=${count}&filter={"type":{"operator":"=","value":"${type}"}}&sort={"id":"desc"}&page=${page}`;
    return axiosExternal.get(url + params);
  },
  getOnboardingCurrentStep: async () => {
    const url = `/onboardProcess/nextStep`;
    return axiosExternal.get(url);
  },
  getListStepOnboarding: async () => {
    const url = `/onboardPhase`;
    return axiosExternal.get(url);
  },
  getStatusOnboarding: async () => {
    const url = `/onboardProcess/status`;
    return axiosExternal.get(url);
  },
  getStatusOnboardingByCode: async (code: string) => {
    const url = `/onboardProcess/status/${code}`;
    return axiosExternal.get(url);
  },
  updateKeyOnboarding: async (key: string, value: string) => {
    const url = `/user`;
    const params = {
      [key]: value,
    };
    return axiosExternal.patch(url, params);
  },
  generateGeneralTopic: async () => {
    const url = `/onboardProcess/setup`;
    return axiosExternal.post(url);
  },
};
