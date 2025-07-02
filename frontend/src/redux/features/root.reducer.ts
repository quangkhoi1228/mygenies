import { combineReducers } from "@reduxjs/toolkit";

import { pathnameReducer } from "./pathname.slice";
import { chatMessagesReducer } from "./chatMessages.slice";
import { chatFreeTalkReducer } from "./chatFreeTalk.slice";
import { audioRecordingReducer } from "./audioRecording.slice";
import { deviceReducer } from "./device.slice";
import { audioPlayerReducer } from "./audioPlayer.slice";
import { sentenceHelloReducer } from "./sentenceHello.slice";
import { userInfoReducer } from "./userInfo.slice";
import { onboardingReducer } from "./onboarding.slice";
import { agentReducer } from "./agent.slice";

const rootReducer = combineReducers({
  chatMessagesState: chatMessagesReducer,
  audioRecordingState: audioRecordingReducer,
  chatFreeTalkState: chatFreeTalkReducer,
  pathnameState: pathnameReducer,
  deviceState: deviceReducer,
  audioPlayerState: audioPlayerReducer,
  sentenceHelloState: sentenceHelloReducer,
  userInfoState: userInfoReducer,
  onboardingState: onboardingReducer,
  agentState: agentReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
