import { dashboardApi } from "@/app/api/axios/dashboardApi";
import { put, call } from "redux-saga/effects";
import { setSentences } from "../features/sentenceHello.slice";

type Get50SentencesHelloResponse = {
  data: {
    data: {
      sentences: string[];
      hint: string;
    }[];
  };
};
export function* get50SentencesHello(): Generator<any, void, any> {
  try {
    const response: Get50SentencesHelloResponse = yield call(dashboardApi.get50SentencesHello);
    yield put(setSentences(response.data.data));
  } catch (error) {
    console.error(error);
  }
}
