import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PathnameState {
  pathname: string;
}

const initialState: PathnameState = {
  pathname: '/',
};

const pathnameSlice = createSlice({
  name: 'pathname',
  initialState,
  reducers: {
    setPathname: (state, action: PayloadAction<string>) => {
      state.pathname = action.payload;
    },
  },
});

export const { setPathname } = pathnameSlice.actions;

export const pathnameReducer = pathnameSlice.reducer;
