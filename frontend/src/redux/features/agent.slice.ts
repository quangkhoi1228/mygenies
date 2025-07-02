import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAiConfigType } from "../types/user-ai-config-type";
import { UserAiType, UserAiListType } from "../types/user-ai-type";

interface AgentState {
  agentConfigList?: UserAiConfigType[];
  editAgentState: UserAiType;
  fullEditAgentState?: UserAiListType;
  createAgentStatus: "idle" | "loading" | "success" | "failed";
  editAgentStatus: "idle" | "loading" | "success" | "failed";
  agentList: UserAiListType[];
  agentListMeta: {
    page: number;
    count: number;
  };
  activeAgent?: UserAiListType;
}

const initialState: AgentState = {
  editAgentState: {
    name: "Doku",
    avatar: "userAiConfigOption_value_avatar_1",
    tone: ["userAiConfigOption_value_tone_4"],
    voice: "userAiConfigOption_value_voice_1",
    ability: ["userAiConfigOption_value_ability_1"],
    maxCharacter: 200,
    maxHintCharacter: 200,
  },
  createAgentStatus: "idle",
  editAgentStatus: "idle",
  agentList: [],
  agentListMeta: {
    page: 1,
    count: 100,
  },
};

const agentSlice = createSlice({
  name: "agentSlice",
  initialState,
  reducers: {
    getAgentConfigList: (state) => {
      state.agentConfigList = [];
    },
    setAgentConfigList: (state, action: PayloadAction<UserAiConfigType[]>) => {
      state.agentConfigList = action.payload;
    },
    setEditAgentState: (state, action: PayloadAction<UserAiType>) => {
      state.editAgentState = action.payload;
    },
    createAgent: (state, action: PayloadAction<UserAiType>) => state,
    setCreateAgentStatus: (
      state,
      action: PayloadAction<"idle" | "loading" | "success" | "failed">
    ) => {
      state.createAgentStatus = action.payload;
    },

    getAgentList: (state) => state,
    setAgentList: (state, action: PayloadAction<UserAiListType[]>) => {
      state.agentList = action.payload;
    },
    setAgentListMeta: (state, action: PayloadAction<Partial<{ page: number; count: number }>>) => {
      state.agentListMeta = { ...state.agentListMeta, ...action.payload };
    },
    updateAgent: (state, action: PayloadAction<{ data: UserAiType; id: number }>) => state,
    getActiveAgent: (state) => state,
    setActiveAgentID: (state, action: PayloadAction<number>) => {},
    setActiveAgent: (state, action: PayloadAction<UserAiListType>) => {
      state.activeAgent = action.payload;
      return state;
    },
    getEditAgentInfo: (state, action: PayloadAction<number>) => state,
    setFullEditAgentState: (state, action: PayloadAction<UserAiListType | undefined>) => {
      state.fullEditAgentState = action.payload;
    },
  },
});

export const {
  getAgentConfigList,
  setAgentConfigList,
  setEditAgentState,
  createAgent,
  setCreateAgentStatus,
  getAgentList,
  setAgentList,
  setAgentListMeta,
  updateAgent,
  getActiveAgent,
  setActiveAgentID,
  setActiveAgent,
  getEditAgentInfo,
  setFullEditAgentState,
} = agentSlice.actions;

export const agentReducer = agentSlice.reducer;
