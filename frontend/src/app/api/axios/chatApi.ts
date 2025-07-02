import axiosExternal from "@/lib/axios-external";

export const chatApi = {
  getTextTranslateToVN: async (text: string) => {
    const url = "/ai/translate";
    return axiosExternal.post(url, {
      text,
    });
  },
  getExpectText: async (text: string) => {
    const url = "/ai/refine";
    return axiosExternal.post(url, {
      userSentence: text,
    });
  },
  translateAudioToText: async (urlFile: string, prompt?: string) => {
    const url = "/ai/transcribe";
    return axiosExternal.post(url, {
      audioUrl: urlFile,
      prompt,
    });
  },
  getFeedbackText: async (userSentence: string, expectedSentence: string) => {
    const url = "/ai/detectMispronunciation";
    return axiosExternal.post(url, {
      userSentence,
      expectedSentence,
    });
  },
  getIdeas(text: string) {
    const url = "/ai/generateIdeas";
    return axiosExternal.post(url, {
      text,
      count: 5,
    });
  },
  getContext: async (params: any) => {
    const url = "/ai/getContext";
    return axiosExternal.post(url, params);
  },
  generateSpeech: async (text: string) => {
    const url = "/ai/generateSpeech";
    return axiosExternal.post(url, {
      text,
    });
  },
  uploadAudio: async (file: FormData) => {
    const url = "/audio/upload";
    return axiosExternal.post(url, file, {
      headers: {
        "Content-Type": "audio/wav",
      },
    });
  },
  deleteConversation: async (id: string) => {
    const url = `/userConversationTopic/history/${id}`;
    return axiosExternal.delete(url);
  },
  getChatFreeTalkHistory: async (params: string) => {
    const url = `/userConversationTopicHistory?`;
    return axiosExternal.get(url + params);
  },
};
