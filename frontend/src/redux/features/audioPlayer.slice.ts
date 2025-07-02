import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AudioPlayerState {
  audioUrl: string;
  isPlaying: boolean;
  isClick: boolean;
}

const initialState: AudioPlayerState = {
  audioUrl: "",
  isPlaying: false,
  isClick: false,
};

const audioPlayerSlice = createSlice({
  name: "audioPlayer",
  initialState,
  reducers: {
    startPlayer: (state) => {
      state.isPlaying = true;
    },
    stopPlayer: (state) => {
      state.isPlaying = false;
    },
    setAudioPlayerUrl: (state, action: PayloadAction<AudioPlayerState["audioUrl"]>) => {
      state.audioUrl = action.payload;
    },
    setIsClick: (state, action: PayloadAction<AudioPlayerState["isClick"]>) => {
      state.isClick = action.payload;
    },
  },
});

export const { startPlayer, stopPlayer, setAudioPlayerUrl } = audioPlayerSlice.actions;
export const audioPlayerActions = audioPlayerSlice.actions;

export const audioPlayerReducer = audioPlayerSlice.reducer;
