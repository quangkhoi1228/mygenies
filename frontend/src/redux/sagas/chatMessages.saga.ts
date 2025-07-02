import axios, { AxiosResponse } from "axios";
import { put, call, delay, select, takeLatest } from "redux-saga/effects";
import { toast } from "sonner";
import { routes } from "@/routes";
import { PayloadType } from "@/redux/shared/types/payload.type";

import { chatApi } from "@/app/api/axios/chatApi";
import {
  stopRecording,
  uploadAudioSuccess,
  AudioRecordingState,
  setCurrentAudioName,
} from "../features/audioRecording.slice";
import {
  setNextStep,
  setChatStatus,
  setCurrentStep,
  clearChatMessage,
  setChattingTitle,
  ChatMessagesState,
  setChatConversation,
  setIsChatProcessing,
  setChatMessagesContext,
  DetectPronunciationType,
  setChattingConversation,
  generateChatConversation,
  startStepByStepConversation,
  setCurrentChatMessageAudioName,
  GenerateChatConversationResponseType,
  updateChatMessageDetectPronunciation,
} from "../features/chatMessages.slice";
import { RootState } from "../store";

export const endConversationSentense: string =
  "Great job! Keep practicing, and you`ll get even better. Confidence comes with every step you take! 😊👏";

export function* setChatMessagesContextHandle() {
  // payload: PayloadType<ChatMessagesState['context']>
  yield put(generateChatConversation());
}

export function* generateChatConversationHandle() {
  const chatMessagesState: ChatMessagesState = yield select(
    (state: RootState) => state.chatMessagesState
  );

  if (!chatMessagesState.context?.topic) {
    // toast.error('Vui lòng nhập chủ đề');
    return;
  }
  const toastId = toast.loading("Đang tạo cuộc hội thoại");

  try {
    const { data } = yield call(axios.post, "/api/chat/", {
      topic: chatMessagesState.context.topic,
      userRole: chatMessagesState.context.userRole,
      systemRole: chatMessagesState.context.systemRole,
    });

    toast.success("Success!", { id: toastId });

    const generateChatConversationRes: GenerateChatConversationResponseType = data.response;
    // const generateChatConversationRes: GenerateChatConversationResponseType =
    //   generateChatConversationResSample;

    // toast.success('Conversation generated successfully');

    // Handle the response as needed
    yield put(setChatConversation(generateChatConversationRes.conversation));
    yield put(setChattingTitle(generateChatConversationRes.title));
    // Start the step-by-step conversation flow
    yield put(startStepByStepConversation());
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error || error.message || "Failed to generate conversation";
      toast.error(message, { id: toastId });
      console.error("Axios error:", error.response?.data);
    } else {
      toast.error("An unexpected error occurred", { id: toastId });
      console.error("Unexpected error:", error);
    }
  } finally {
    toast.dismiss(toastId);
  }
}

export function* startStepByStepConversationHandle() {
  const chatMessagesState: ChatMessagesState = yield select(
    (state: RootState) => state.chatMessagesState
  );

  yield put(setChatStatus("start"));
  if (chatMessagesState.currentStep !== 0) {
    yield put(setCurrentStep(0));
  }
}

export function* textToSpeech(text: string) {
  if (!text) {
    toast.error("Vui lòng nhập đoạn text cần đọc");
    return;
  }

  try {
    // Make the API call to generate speech from the text
    const { data } = yield call(chatApi.generateSpeech, text);

    const ttsRes: {
      filename: string;
    } = data;

    const audio = new Audio(ttsRes.filename);

    // Start playing the audio in the background
    audio.play().catch((error) => {
      console.error("Failed to play audio:", error);
    });

    // eslint-disable-next-line consistent-return
    return text.split(" ").length * 400;
  } catch (error) {
    console.error("Error generating speech:", error);
    toast.error("Kudo khan giọng rồi!! Hãy tặng energy để KuDo nói lại được nhé!");
  }
}

export function* setCurrentStepHandle(payload: PayloadType<number>) {
  if (payload.payload === -1) {
    yield put(setChatStatus("idle"));
    return;
  }
  const chatMessagesState: ChatMessagesState = yield select(
    (state: RootState) => state.chatMessagesState
  );

  const { currentStep } = chatMessagesState;
  const currentConversation = chatMessagesState.conversation[currentStep];

  if (currentConversation.role === "user") {
    yield put(
      setChattingConversation([...chatMessagesState.chattingConversation, currentConversation])
    );

    const audioName = new Date().getTime().toString();
    yield put(setCurrentAudioName(audioName));
    yield put(setCurrentChatMessageAudioName(audioName));
  } else {
    yield put(
      setChattingConversation([...chatMessagesState.chattingConversation, currentConversation])
    );
    // const audioDuration: number = yield call(textToSpeech, currentConversation.sentence);

    // yield delay(audioDuration); // Wait until the audio is finished playing

    yield put(setNextStep());
  }
}

export function* setNextStepHandle() {
  yield delay(0);
  const chatMessagesState: ChatMessagesState = yield select(
    (state: RootState) => state.chatMessagesState
  );

  const { currentStep } = chatMessagesState;

  if (currentStep + 1 < chatMessagesState.conversation.length) {
    yield put(setCurrentStep(currentStep + 1));
  } else {
    yield put(setChatStatus("end"));
    yield call(textToSpeech, endConversationSentense);
  }
  // TODO: Call API speech to t
}

export async function transcribeAudioFromUrl(fileUrl: string, prompt?: string) {
  try {
    const response = await chatApi.translateAudioToText(fileUrl, prompt);
    return response.data; // Expected response: { transcription: "..." }
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to transcribe audio");
  }
}

export function* uploadAudioSuccessHandle() {
  // const valid: boolean = yield call(checkPathname, routes.topic.url);
  // if (!valid) {
  //   return;
  // }
  try {
    const audioRecordingState: AudioRecordingState = yield select(
      (state: RootState) => state.audioRecordingState
    );

    const chatMessagesState: ChatMessagesState = yield select(
      (state: RootState) => state.chatMessagesState
    );

    if (!audioRecordingState.currentAudioName) {
      throw new Error("File URL is missing");
    }

    if (chatMessagesState.currentChatMessageAudioName === audioRecordingState.currentAudioName) {
      const fileUrl =
        audioRecordingState.audioRecordings[chatMessagesState.currentChatMessageAudioName].url; // Ensure this contains the correct file URL
      // Call /api/transcribe with fileUrl
      const { transcription } = yield call(transcribeAudioFromUrl, fileUrl);

      yield put(
        updateChatMessageDetectPronunciation({
          expect: chatMessagesState.conversation[chatMessagesState.currentStep].sentence,
          userInput: transcription,
          resultExpect: [],
        })
      );
      const detectPronunciationRes: AxiosResponse = yield call(
        chatApi.getFeedbackText,
        transcription,
        chatMessagesState.conversation[chatMessagesState.currentStep].sentence
      );

      const detectPronunciation: DetectPronunciationType = detectPronunciationRes.data.response;

      yield put(
        updateChatMessageDetectPronunciation({
          expect: detectPronunciation.expect,
          userInput: transcription,
          resultExpect: detectPronunciation.resultExpect,
        })
      );

      // Calculate pronunciation score
      const score = calculateScore(detectPronunciation.resultExpect);

      if (score > 50) {
        yield put(setNextStep());
      } else {
        toast.warning("Your pronunciation score is too low. Try again!");
      }
    }
  } catch (error) {
    toast.warning("Your voice is too low! Try again!");
    console.error("Error:", error);
  } finally {
    yield put(setIsChatProcessing(false));
  }
}

function calculateScore(results: Array<{ word: string; analysis: Record<string, number> }>) {
  if (!results.length) return 0;

  let totalCharacters = 0;
  let correctCharacters = 0;

  results.forEach((result) => {
    const characters = Object.values(result.analysis);
    totalCharacters += characters.length;
    correctCharacters += characters.reduce((sum, score) => sum + score, 0);
  });

  return Math.round((correctCharacters / totalCharacters) * 100);
}

export function* handleStopRecording() {
  const valid: boolean = yield call(checkPathname, routes.topic.url);
  if (!valid) {
    return;
  }
  yield put(setIsChatProcessing(true));
}

export function* clearChatMessageHandle() {
  const valid: boolean = yield call(checkPathname, routes.topic.url);
  if (!valid) {
    return;
  }
  yield put(
    setChatMessagesContext({
      topic: "",
      userRole: "",
      systemRole: "",
    })
  );

  yield put(setChatStatus("idle"));
  yield put(setChattingConversation([]));
  yield put(setCurrentStep(-1));
  yield put(setChattingTitle(""));
}

export function* checkPathname(validPathname: string) {
  const pathname: string = yield select((state: RootState) => state.pathnameState.pathname);

  return validPathname === pathname;
}

export function* chatMessagesSaga() {
  yield takeLatest(setChatMessagesContext, setChatMessagesContextHandle);
  yield takeLatest(generateChatConversation, generateChatConversationHandle);
  yield takeLatest(startStepByStepConversation, startStepByStepConversationHandle);
  yield takeLatest(setCurrentStep, setCurrentStepHandle);
  yield takeLatest(uploadAudioSuccess, uploadAudioSuccessHandle);
  yield takeLatest(stopRecording, handleStopRecording);
  yield takeLatest(setNextStep, setNextStepHandle);
  yield takeLatest(clearChatMessage, clearChatMessageHandle);
}
