import { all } from "redux-saga/effects";

import { audioRecordingSaga } from "./audioRecording.saga";
import { chatFreeTalkSaga } from "./chatFreeTalk.saga";
import { chatMessagesSaga } from "./chatMessages.saga";
import { getDeviceType } from "./device.saga";
import { onboardingSaga } from "./onboarding.saga";
import { get50SentencesHello } from "./sentenceHello.saga";
import { agentSaga } from "./agent.saga";

export function* rootSaga() {
  yield all([
    getDeviceType(),
    get50SentencesHello(),
    chatMessagesSaga(),
    audioRecordingSaga(),
    chatFreeTalkSaga(),
    onboardingSaga(),
    agentSaga(),
  ]);
}
