import { PayloadAction } from "@reduxjs/toolkit";
import { put, call, select, takeLatest } from "redux-saga/effects";
import { toast } from "sonner";
import { agentApi } from "@/app/api/axios/agentApi";
import {
  createAgent,
  updateAgent,
  getAgentList,
  setAgentList,
  getActiveAgent,
  setActiveAgent,
  setAgentListMeta,
  setActiveAgentID,
  getEditAgentInfo,
  setEditAgentState,
  getAgentConfigList,
  setAgentConfigList,
  setCreateAgentStatus,
  setFullEditAgentState,
} from "../features/agent.slice";
import { UserAiType, UserAiListType } from "../types/user-ai-type";
import { RootState } from "../store";

function* getAgentConfigListHandle() {
  try {
    const { data } = yield call(agentApi.getAgentConfigList);
    yield put(setAgentConfigList(data));
  } catch (error) {
    console.log(error);
  }
}

function* createAgentHandle(action: PayloadAction<UserAiType>) {
  try {
    const { data } = yield call(agentApi.createAgent, action.payload);
    console.log(data);
    toast.success("Create agent success");
    yield put(setCreateAgentStatus("success"));
    yield put(getAgentList());
  } catch (error) {
    console.log(error);
    toast.error("Create agent failed");
    yield put(setCreateAgentStatus("failed"));
  }
}

function* getAgentListHandle() {
  try {
    const { page, count } = yield select((state: RootState) => state.agentState.agentListMeta);
    const { data } = yield call(agentApi.getAgentList, {
      page,
      count,
    });
    yield put(setAgentList(data.data));
  } catch (error) {
    console.log(error);
  }
}

function* setAgentListMetaHandle(action: PayloadAction<Partial<{ page: number; count: number }>>) {
  try {
    yield put(getAgentList());
  } catch (error) {
    console.log(error);
  }
}

function* getActiveAgentHandle() {
  try {
    const { data } = yield call(agentApi.getActiveAgent);
    console.log("data", data);
    yield put(setActiveAgent(data));
  } catch (error) {
    console.log(error);
  }
}

function* setActiveAgentIDHandle(action: PayloadAction<number>) {
  try {
    toast.success("Set active agent success");
    yield call(agentApi.setActiveAgent, action.payload);
    yield put(getActiveAgent());
  } catch (error) {
    console.log(error);
  }
}

function* getEditAgentInfoHandle(action: PayloadAction<number>) {
  try {
    const { data }: { data: UserAiListType } = yield call(agentApi.getAgentDetail, action.payload);
    yield put(setEditAgentState(data.userAiInfo));
    yield put(setFullEditAgentState(data));
  } catch (error) {
    console.log(error);
  }
}

function* updateAgentHandle(action: PayloadAction<{ data: UserAiType; id: number }>) {
  try {
    const { data } = yield call(agentApi.updateAgent, action.payload.id, action.payload.data);
    console.log(data);
    toast.success("Update agent success");
    yield put(setCreateAgentStatus("success"));
  } catch (error) {
    console.log(error);
    yield put(setCreateAgentStatus("failed"));
  }
}
export function* agentSaga() {
  yield takeLatest(getAgentConfigList, getAgentConfigListHandle);
  yield takeLatest(createAgent, createAgentHandle);
  yield takeLatest(updateAgent, updateAgentHandle);
  yield takeLatest(getAgentList, getAgentListHandle);
  yield takeLatest(setAgentListMeta, setAgentListMetaHandle);
  yield takeLatest(getActiveAgent, getActiveAgentHandle);
  yield takeLatest(setActiveAgentID, setActiveAgentIDHandle);
  yield takeLatest(getEditAgentInfo, getEditAgentInfoHandle);
}
