import { createSlice } from "@reduxjs/toolkit";

type SentenceHelloState = {
  sentences: {
    sentence: string;
    hint: string;
  }[];
};

const initialState: SentenceHelloState = {
  sentences: [],
};

const sentenceHelloSlice = createSlice({
  name: "sentenceHello",
  initialState,
  reducers: {
    setSentences: (state, action) => {
      state.sentences = action.payload;
    },
  },
});

export const { setSentences } = sentenceHelloSlice.actions;
export const sentenceHelloReducer = sentenceHelloSlice.reducer;
