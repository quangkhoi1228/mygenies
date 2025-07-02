import axios from "axios";
import { put, call, delay, select, takeEvery, takeLatest } from "redux-saga/effects";
import { toast } from "sonner";

import { maxBy, sampleSize } from "lodash";
import { chatApi } from "@/app/api/axios/chatApi";
import { dashboardApi } from "@/app/api/axios/dashboardApi";
import { PayloadType } from "@/redux/shared/types/payload.type";
import {
  stopRecording,
  uploadAudioSuccess,
  AudioRecordingState,
  setCurrentAudioName,
} from "../features/audioRecording.slice";
import {
  ChatFreeTalkType,
  ChatFreeTalkState,
  deleteConversation,
  addFreeTalkNewMessage,
  setChatFreeTalkStatus,
  getChatFreeTalkContext,
  setChatFreeTalkContext,
  setCurrentFreeChatStep,
  clearChatFreeTalkMessage,
  setChattingFreeTalkTitle,
  setFreeTalkHintSentences,
  setChatFreeTalkCurrentTurn,
  setFreeTalkSampleSentences,
  setIsChatFreeTalkProcessing,
  setChattingFreeTalkConversation,
  GenerateChatSayHelloResponseType,
  setCurrentChatFreeTalkMessageAudioName,
} from "../features/chatFreeTalk.slice";
import { roleType } from "../features/chatMessages.slice";
import { RootState } from "../store";
import { checkMicPermission } from "./audioRecording.saga";
import { transcribeAudioFromUrl, endConversationSentense } from "./chatMessages.saga";

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function* startStepByStepConversationHandle() {
  const chatFreeTalkState: ChatFreeTalkState = yield select(
    (state: RootState) => state.chatFreeTalkState
  );

  yield put(setChatFreeTalkStatus("start"));
  if (chatFreeTalkState.currentStep !== 0) {
    yield put(setCurrentFreeChatStep(0));
  }
}

export function* uploadAudioSuccessHandle() {
  try {
    const audioRecordingState: AudioRecordingState = yield select(
      (state: RootState) => state.audioRecordingState
    );

    const chatFreeTalkState: ChatFreeTalkState = yield select(
      (state: RootState) => state.chatFreeTalkState
    );

    if (!audioRecordingState.currentAudioName) {
      throw new Error("File URL is missing");
    }
    if (chatFreeTalkState.currentChatMessageAudioName === audioRecordingState.currentAudioName) {
      const fileUrl =
        audioRecordingState.audioRecordings[chatFreeTalkState.currentChatMessageAudioName].url; // Ensure this contains the correct file URL
      // Call /api/transcribe with fileUrl
      const prompt = `
      'context': ${JSON.stringify(chatFreeTalkState.context)}
      'chatHistory': ${chatFreeTalkState.chattingConversation
        .slice(-1)
        .map((chatMessage) => `${chatMessage.role}: ${chatMessage.sentence}`)
        .join("\n")}
      `;
      const { transcription } = yield call(transcribeAudioFromUrl, fileUrl, prompt);

      if (transcription) {
        yield put(
          addFreeTalkNewMessage([
            {
              sentense: transcription,
              role: "user",
            },
          ])
        );
        if (chatFreeTalkState.roleActive) {
          console.log("active role"); // do not remove this comment
          const lastOrder = maxBy(chatFreeTalkState.chattingConversation, "order")?.order;
          const params = {
            userConversationTopicId: Number(chatFreeTalkState.id),
            sentence: transcription,
            role: "user",
            order: lastOrder ? lastOrder + 1 : chatFreeTalkState.chattingConversation.length,
          };
          yield call(addMessageToConversation, params);
        }
        yield put(setChatFreeTalkCurrentTurn("system"));
      } else {
        toast.error("Your voice is too low! Try again!");
      }
    }
  } catch (error) {
    toast.warning("Your voice is too low! Try again!");
    console.error("Error:", error);
  } finally {
    yield put(setIsChatFreeTalkProcessing(false));
  }
}

export function* handleStopRecording() {
  const permission: boolean = yield call(checkMicPermission);
  if (!permission) {
    return;
  }
  const audioName = new Date().getTime().toString();

  yield put(setCurrentAudioName(audioName));

  yield put(setCurrentChatFreeTalkMessageAudioName(audioName));
  yield put(setIsChatFreeTalkProcessing(true));
}

export function* getChatFreeTalkContextHandle() {
  yield delay(0);
  const chatFreeTalkState: ChatFreeTalkState = yield select(
    (state: RootState) => state.chatFreeTalkState
  );

  try {
    const { data } = yield call(chatApi.getContext, {
      quantity: 20,
      chatHistory: chatFreeTalkState.chattingConversation,
      roleBased: chatFreeTalkState.roleActive,
      ...(chatFreeTalkState.roleActive && { ...chatFreeTalkState.role, hintQuantity: 5 }),
    });

    const res: GenerateChatSayHelloResponseType = data;

    yield put(setChatFreeTalkContext(res.context));
    if (
      !chatFreeTalkState.chattingTitle &&
      res.context &&
      !Object.values(res.context).includes("")
    ) {
      yield put(setChattingFreeTalkTitle(res.title));
    }

    let newSentence: string = "";

    if (res.sentence) {
      newSentence = res.sentence;
    } else {
      const randomSayHelloSentence =
        res.sayHelloSentences[Math.floor(Math.random() * res.sayHelloSentences.length)];

      newSentence = randomSayHelloSentence;
    }
    yield put(
      addFreeTalkNewMessage([
        {
          sentense: newSentence,
          role: "system",
        },
      ])
    );

    if (chatFreeTalkState.id) {
      const lastOrder = maxBy(chatFreeTalkState.chattingConversation, "order")?.order;
      console.log("chatFreeTalkState"); // do not remove this comment

      const params = {
        userConversationTopicId: Number(chatFreeTalkState.id),
        sentence: newSentence,
        role: "system",
        order: lastOrder ? lastOrder + 1 : chatFreeTalkState.chattingConversation.length,
      };
      yield call(addMessageToConversation, params);
    }

    if (res?.hintSentences?.length > 0) {
      yield put(setFreeTalkHintSentences(res.hintSentences));
    }

    if (res?.sampleSentences?.length > 0) {
      yield put(setFreeTalkSampleSentences(res.sampleSentences));
    }
    yield put(setChatFreeTalkStatus(res.status));
    if (res.status === "end") {
      yield put(
        addFreeTalkNewMessage([
          {
            sentense: endConversationSentense,
            role: "system",
          },
        ])
      );
      if (chatFreeTalkState.id) {
        yield call(dashboardApi.setEndTopicCustomization, chatFreeTalkState.id);
      }
      yield put(setFreeTalkHintSentences([]));
      yield put(setFreeTalkSampleSentences([]));
    } else {
      yield put(setChatFreeTalkCurrentTurn("user"));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
async function addMessageToConversation({
  sentence,
  role,
  order,
  userConversationTopicId,
}: {
  sentence: string;
  role: string;
  order: number;
  userConversationTopicId: number;
}) {
  try {
    const { data } = await dashboardApi.addMessageToConversation(
      userConversationTopicId,
      sentence,
      role,
      order
    );
    return data;
  } catch (error) {
    return null;
  }
}

export function* clearChatFreeTalkMessageHandle() {
  yield put(
    setChatFreeTalkContext({
      topic: "",
      userRole: "",
      systemRole: "",
    })
  );
  yield put(setChatFreeTalkStatus("idle"));
  yield put(setChattingFreeTalkConversation([]));
  yield put(setCurrentFreeChatStep(-1));
  yield put(setChattingFreeTalkTitle(""));
  yield put(setFreeTalkHintSentences([]));
}

export function* setChatFreeTalkCurrentTurnHandle(
  payload: PayloadType<ChatFreeTalkState["currentTurn"]>
) {
  const currentTurn = payload.payload;
  if (currentTurn === "system") {
    yield put(getChatFreeTalkContext());
  } else {
    // "user");
  }
}

function* createMessage({ sentense, role }: { sentense: string; role: roleType }) {
  const chatFreeTalkState: ChatFreeTalkState = yield select(
    (state: RootState) => state.chatFreeTalkState
  );
  const lastOrder = maxBy(chatFreeTalkState.chattingConversation, "order")?.order;
  const message: ChatFreeTalkType = {
    role,
    sentence: sentense,
    order: lastOrder ? lastOrder + 1 : chatFreeTalkState.chattingConversation.length,
    id: sampleSize(chars, 10).join(""),
  };

  return message;
}

function* addFreeTalkNewMessageHandle(
  payload: PayloadType<{ sentense: string; role: roleType }[]>
) {
  const chatFreeTalkState: ChatFreeTalkState = yield select(
    (state: RootState) => state.chatFreeTalkState
  );

  const newMessages: ChatFreeTalkType[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const newMessageInfo of payload.payload) {
    const userSentence: ChatFreeTalkType = yield createMessage({
      sentense: newMessageInfo.sentense,
      role: newMessageInfo.role,
    });
    newMessages.push(userSentence);
  }

  yield put(
    setChattingFreeTalkConversation([...chatFreeTalkState.chattingConversation, ...newMessages])
  );
}
function* deleteConversationHandle(payload: PayloadType<string>) {
  yield call(deleteConversationApi, payload.payload);
}
async function deleteConversationApi(id: string) {
  try {
    const { data } = await chatApi.deleteConversation(id);
    return data;
  } catch (error) {
    toast.error("Failed to delete conversation");
    return null;
  }
}

export function* chatFreeTalkSaga() {
  // yield takeLatest(setChatFreeTalkStatus, setChatFreeTalkStatusHandle);
  yield takeLatest(getChatFreeTalkContext, getChatFreeTalkContextHandle);
  yield takeLatest(clearChatFreeTalkMessage, clearChatFreeTalkMessageHandle);
  yield takeEvery(setChatFreeTalkCurrentTurn, setChatFreeTalkCurrentTurnHandle);
  yield takeLatest(deleteConversation, deleteConversationHandle);

  yield takeLatest(uploadAudioSuccess, uploadAudioSuccessHandle);
  yield takeLatest(stopRecording, handleStopRecording);
  yield takeEvery(addFreeTalkNewMessage, addFreeTalkNewMessageHandle);
}
