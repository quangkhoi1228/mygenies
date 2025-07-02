import { put, call, delay, select, takeLatest } from "redux-saga/effects";
// import { Id } from '@/convex/_generated/dataModel';

import { toast } from "sonner";
import { chatApi } from "@/app/api/axios/chatApi";
import {
  uploadAudio,
  stopRecording,
  startRecording,
  AudioRecordingType,
  setStatusRecording,
  uploadAudioFailure,
  uploadAudioSuccess,
  AudioRecordingState,
} from "../features/audioRecording.slice";

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let stream: MediaStream;

function* createMediaStream() {
  try {
    const streamObject: MediaStream = yield call(() =>
      navigator.mediaDevices.getUserMedia({ audio: true })
    );
    return streamObject;
  } catch (err) {
    console.error("Error starting recording:", err);
    // yield put(uploadAudioFailure());
    return null;
  }
}
async function requestPermission() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    stream.getTracks().forEach((track) => track.stop());
  } catch (err) {
    console.error(err);
  }
}
export async function checkMicPermission() {
  if (!navigator.permissions) {
    return false;
  }
  try {
    const status = await navigator.permissions.query({ name: "microphone" });

    if (status.state === "granted") {
      return true;
    }
    if (status.state === "denied") {
      return false;
    }
    return false;
  } catch (err) {
    // console.error("Không thể kiểm tra quyền micro:", err);
    return false;
  }
}
// **Start Recording**
function* handleStartRecording() {
  const permission: boolean = yield call(checkMicPermission);
  if (permission) {
    yield put(setStatusRecording(true));
    stream = yield call(createMediaStream);
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    mediaRecorder.start();
    // yield put(uploadAudio());
  } else {
    toast.error("Please allow microphone permission");
    yield put(setStatusRecording(false));
    yield call(requestPermission);
  }
}

// **Stop Recording**
function* handleStopRecording(): Generator<any, void, any> {
  const permission: boolean = yield call(checkMicPermission);
  if (!permission) {
    return;
  }

  try {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      yield new Promise<void>((resolve) => {
        if (mediaRecorder) {
          mediaRecorder.onstop = () => resolve();
          mediaRecorder.stop();
        }
      });
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

      stream.getTracks().forEach((track) => track.stop());
      yield put(uploadAudio());

      // Call API for transcription
      const transcription: AudioRecordingType = yield call(transcribeAudio, audioBlob);
      yield put(uploadAudioSuccess(transcription));
    } else {
      yield delay(500);
      yield call(handleStopRecording);
    }
  } catch (error) {
    yield put(uploadAudioFailure());
  }
}
function* transcribeAudio(blob: Blob) {
  try {
    // Get audio recording state from Redux
    const audioRecordingState: AudioRecordingState = yield select(
      (state) => state.audioRecordingState
    );

    // Upload the file
    const file = new File([blob], "audio.wav", { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", file);

    const { data } = yield call(chatApi.uploadAudio, formData);
    if (!data.url) throw new Error("Upload failed");

    return { url: data.url, name: audioRecordingState.currentAudioName };
  } catch (error) {
    console.error("Error in transcribeAudio:", error);
    throw error;
  }
}
// **Watcher saga**
export function* audioRecordingSaga() {
  yield takeLatest(startRecording, handleStartRecording);
  yield takeLatest(stopRecording, handleStopRecording);
}
