import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AudioRecordingType = {
  storageId: string;
  url: string;
  name: string;
};
export type AudioRecordingStatus = boolean;
export interface AudioRecordingState {
  isRecording: boolean;
  isUploading: boolean;
  audioRecordings: {
    [audioName: string]: AudioRecordingType;
  };
  currentAudioName?: string;
}

const initialState: AudioRecordingState = {
  isRecording: false,
  isUploading: false,
  audioRecordings: {},
  currentAudioName: "",
};

const audioRecordingSlice = createSlice({
  name: "audioRecording",
  initialState,
  reducers: {
    startRecording: (state) => {
      // state.isRecording = true;
    },
    setStatusRecording: (state, action: PayloadAction<AudioRecordingStatus>) => {
      state.isRecording = action.payload;
    },
    stopRecording: (state) => {
      state.isRecording = false;
    },
    uploadAudio: (state) => {
      state.isUploading = true;
    },
    uploadAudioSuccess: (state, action: PayloadAction<AudioRecordingType>) => {
      state.isUploading = false;
      state.audioRecordings = {
        ...state.audioRecordings,
        [action.payload.name]: action.payload,
      };
    },
    uploadAudioFailure: (state) => {
      state.isUploading = false;
    },
    setCurrentAudioName: (state, action: PayloadAction<string>) => {
      state.currentAudioName = action.payload;
    },
  },
});

export const {
  startRecording,
  stopRecording,
  uploadAudio,
  uploadAudioSuccess,
  uploadAudioFailure,
  setCurrentAudioName,
  setStatusRecording,
} = audioRecordingSlice.actions;
export const audioRecordingActions = audioRecordingSlice.actions;

export const audioRecordingReducer = audioRecordingSlice.reducer;
