import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeviceTypeState {
  isTouch: boolean;
}

const initialState: DeviceTypeState = {
  isTouch: false,
};

const deviceSlice = createSlice({
  name: "deviceSlice",
  initialState,
  reducers: {
    setTouchDevice: (state, action: PayloadAction<boolean>) => {
      state.isTouch = action.payload;
    },
  },
});

export const { setTouchDevice } = deviceSlice.actions;

export const deviceReducer = deviceSlice.reducer;
