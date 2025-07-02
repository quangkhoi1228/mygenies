import { createSlice } from "@reduxjs/toolkit";

type UserInfoState = {
  userInfo: any;
};

const initialState: UserInfoState = {
  userInfo: null,
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setUserInfo } = userInfoSlice.actions;
export const userInfoReducer = userInfoSlice.reducer;
