import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PayloadType } from "@/redux/shared/types/payload.type";

import { roleType } from "./chatMessages.slice";

export type DetectPronunciationType = {
  expect: string;
  userInput: string;
  resultExpect: {
    word: string;
    analysis: {
      [key: string]: number;
    };
  }[];
};

export type ChatFreeTalkType = {
  role: roleType;
  sentence: string;
  order: number;
  detectPronunciation?: DetectPronunciationType;
  id: string;
};

export type ChatFreeTalkRefineType = {
  originalSentence: string;
  refinedSentence: string;
};
export type ChatFreeTalkRoleType = {
  topic: string;
  systemRole: string;
  userRole: string;
};

export type ChatFreeTalkState = {
  context?: {
    topic: string;
    userRole: string;
    systemRole: string;
  };
  sayHelloSentences: string[];
  hintSentences: string[];
  sampleSentences: string[];
  conversation: ChatFreeTalkType[];
  status: "idle" | "start" | "chatting" | "end";
  currentStep: number;
  chattingConversation: ChatFreeTalkType[];
  chattingTitle: string;
  currentChatMessageAudioName?: string;
  isChatProcessing: boolean;
  currentTurn: roleType;
  roleActive: boolean;
  role: ChatFreeTalkRoleType;
  firstChat: boolean;
  id: string;
};

export type GenerateChatSayHelloResponseType = {
  context: ChatFreeTalkState["context"];
  title: string;
  sayHelloSentences: ChatFreeTalkState["sayHelloSentences"];
  hintSentences: ChatFreeTalkState["hintSentences"];
  sampleSentences: ChatFreeTalkState["sampleSentences"];
  sentence: string;
  status: ChatFreeTalkState["status"];
};

const initialState: ChatFreeTalkState = {
  status: "idle",
  currentStep: -1,
  firstChat: false,
  conversation: [],
  chattingConversation: [],
  isChatProcessing: false,
  chattingTitle: "",
  sayHelloSentences: [],
  hintSentences: [],
  currentTurn: "system",
  sampleSentences: [],
  roleActive: false,
  role: {
    topic: "",
    systemRole: "",
    userRole: "",
  },
  id: "",
};

export const ChatFreeTalkSlice = createSlice({
  name: "chatFreeTalkSlice",
  initialState,
  reducers: {
    setIdConversation: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    getChatFreeTalkContext: (state: ChatFreeTalkState) =>
      // set list
      state,
    setChatFreeTalkContext: (
      state: ChatFreeTalkState,
      payload: PayloadType<ChatFreeTalkState["context"]>
    ) =>
      // set list
      ({ ...state, context: payload.payload }),
    setChatFreeTalkConversation: (
      state: ChatFreeTalkState,
      payload: PayloadType<ChatFreeTalkState["conversation"]>
    ) =>
      // set list
      ({ ...state, conversation: payload.payload }),
    setChatFreeTalkStatus: (
      state: ChatFreeTalkState,
      payload: PayloadType<ChatFreeTalkState["status"]>
    ) => ({ ...state, status: payload.payload }),
    setCurrentFreeChatStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    startStepByStepFreeTalkConversation: (state) => ({ ...state, status: "chatting" }),
    setChattingFreeTalkConversation: (state, action: PayloadAction<ChatFreeTalkType[]>) => ({
      ...state,
      chattingConversation: action.payload,
    }),
    setCurrentChatFreeTalkMessageAudioName: (state, action: PayloadAction<string>) => {
      state.currentChatMessageAudioName = action.payload;
    },

    updateChatFreeTalkMessageDetectPronunciation: (
      state,
      action: PayloadAction<DetectPronunciationType>
    ) => {
      state.chattingConversation[state.currentStep].detectPronunciation = action.payload;
    },
    setIsChatFreeTalkProcessing: (state, action: PayloadAction<boolean>) => {
      state.isChatProcessing = action.payload;
    },
    setChattingFreeTalkTitle: (state, action: PayloadAction<string>) => {
      state.chattingTitle = action.payload;
    },
    deleteConversation: (state, action: PayloadAction<string>) => {},
    setFreeTalkNextStep: () => {},
    clearChatFreeTalkMessage: () => {},
    getChatFreeTalkHistory: (state, action: PayloadAction<string>) => {
      // state.id = action.payload;
    },
    setChatFreeTalkCurrentTurn: (
      state,
      action: PayloadAction<ChatFreeTalkState["currentTurn"]>
    ) => {
      state.currentTurn = action.payload;
    },
    setFreeTalkHintSentences: (
      state,
      action: PayloadAction<ChatFreeTalkState["hintSentences"]>
    ) => {
      state.hintSentences = action.payload;
    },

    addFreeTalkNewMessage: (state, _: PayloadAction<{ sentense: string; role: roleType }[]>) =>
      state,
    setFreeTalkSampleSentences: (
      state,
      action: PayloadAction<ChatFreeTalkState["sampleSentences"]>
    ) => {
      state.sampleSentences = action.payload;
    },
    setRoleActive: (state, action: PayloadAction<boolean>) => {
      state.roleActive = action.payload;
    },
    setRole: (state, action: PayloadAction<ChatFreeTalkRoleType>) => {
      state.role = action.payload;
    },
    setFirstChat: (state, action: PayloadAction<boolean>) => {
      state.firstChat = action.payload;
    },
  },
});

export const chatFreeTalkReducer = ChatFreeTalkSlice.reducer;
export const {
  deleteConversation,
  getChatFreeTalkContext,
  setChatFreeTalkContext,
  setFreeTalkSampleSentences,
  setChatFreeTalkConversation,
  setChatFreeTalkStatus,
  setCurrentFreeChatStep,
  startStepByStepFreeTalkConversation,
  setChattingFreeTalkConversation,
  setCurrentChatFreeTalkMessageAudioName,
  updateChatFreeTalkMessageDetectPronunciation,
  setIsChatFreeTalkProcessing,
  getChatFreeTalkHistory,
  setChattingFreeTalkTitle,
  setFreeTalkNextStep,
  clearChatFreeTalkMessage,
  setChatFreeTalkCurrentTurn,
  setFreeTalkHintSentences,
  addFreeTalkNewMessage,
  setRoleActive,
  setRole,
  setFirstChat,
  setIdConversation,
} = ChatFreeTalkSlice.actions;
