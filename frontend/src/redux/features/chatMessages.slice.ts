import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PayloadType } from '@/redux/shared/types/payload.type';

export type roleType = 'user' | 'system' | '' | null;
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

export type ChatMessageType = {
  role: string;
  sentence: string;
  order: number;
  detectPronunciation?: DetectPronunciationType;
};

export type ChatMessagesState = {
  context?: {
    topic: string;
    userRole: string;
    systemRole: string;
  };
  conversation: ChatMessageType[];
  status: 'idle' | 'start' | 'chatting' | 'end';
  currentStep: number;
  chattingConversation: ChatMessageType[];
  chattingTitle: string;
  currentChatMessageAudioName?: string;
  isChatProcessing: boolean;
};

export type GenerateChatConversationResponseType = {
  context: ChatMessagesState['context'];
  conversation: ChatMessagesState['conversation'];
  chattingConversation: ChatMessagesState['chattingConversation'];
  title: string;
};

const initialState: ChatMessagesState = {
  status: 'idle',
  currentStep: -1,
  conversation: [],
  chattingConversation: [],
  isChatProcessing: false,
  chattingTitle: '',
};

export const ChatMessagesSlice = createSlice({
  name: 'chatTopicSlice',
  initialState,
  reducers: {
    getChatMessagesContext: (state: ChatMessagesState) =>
      // set list
      state,
    setChatMessagesContext: (
      state: ChatMessagesState,
      payload: PayloadType<ChatMessagesState['context']>
    ) =>
      // set list
      ({ ...state, context: payload.payload }),
    generateChatConversation: (state: ChatMessagesState) =>
      // set list
      state,
    setChatConversation: (
      state: ChatMessagesState,
      payload: PayloadType<ChatMessagesState['conversation']>
    ) =>
      // set list
      ({ ...state, conversation: payload.payload }),
    setChatStatus: (
      state: ChatMessagesState,
      payload: PayloadType<ChatMessagesState['status']>
    ) => ({ ...state, status: payload.payload }),
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    startStepByStepConversation: (state) => ({ ...state, status: 'chatting' }),
    setChattingConversation: (state, action: PayloadAction<ChatMessageType[]>) => ({
      ...state,
      chattingConversation: action.payload,
    }),
    setCurrentChatMessageAudioName: (state, action: PayloadAction<string>) => {
      state.currentChatMessageAudioName = action.payload;
    },

    updateChatMessageDetectPronunciation: (
      state,
      action: PayloadAction<DetectPronunciationType>
    ) => {
      state.chattingConversation[state.currentStep].detectPronunciation = action.payload;
    },
    setIsChatProcessing: (state, action: PayloadAction<boolean>) => {
      state.isChatProcessing = action.payload;
    },
    setChattingTitle: (state, action: PayloadAction<string>) => {
      state.chattingTitle = action.payload;
    },
    setNextStep: () => {},
    clearChatMessage: () => {},
  },
});

export const chatMessagesReducer = ChatMessagesSlice.reducer;
export const {
  getChatMessagesContext,
  setChatMessagesContext,
  generateChatConversation,
  setChatConversation,
  setChatStatus,
  setCurrentStep,
  startStepByStepConversation,
  setChattingConversation,
  setCurrentChatMessageAudioName,
  updateChatMessageDetectPronunciation,
  setIsChatProcessing,
  setChattingTitle,
  setNextStep,
  clearChatMessage,
} = ChatMessagesSlice.actions;
