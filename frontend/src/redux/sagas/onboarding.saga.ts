import { get } from "lodash";
import { toast } from "sonner";
import { dashboardApi } from "@/app/api/axios/dashboardApi";
import { put, call, select, takeLatest } from "redux-saga/effects";

import { RootState } from "../store";
import { onboardingActions } from "../features/onboarding.slice";

function isValidStringJson(str: any) {
  if (typeof str !== "string") return false;
  try {
    const json = JSON.parse(str);
    if (Array.isArray(json)) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export function* onboardingSaga() {
  yield takeLatest(onboardingActions.getStatusOnboarding, getStatusOnboarding);
  yield takeLatest(onboardingActions.continueActionOnboarding, continueActionOnboarding);
  yield takeLatest(onboardingActions.previousActionOnboarding, previousActionOnboarding);
}

function* previousActionOnboarding() {
  const { step, previousCode } = yield select((state: RootState) => state.onboardingState);
  yield put(onboardingActions.setUserSelected(""));
  const { data } = yield call(getStatusOnboardingByCode, previousCode);
  yield call(setDataOnboarding, data);
}
function* getStatusOnboardingByCode(code: string): Generator<any, any, any> {
  try {
    return yield call(dashboardApi.getStatusOnboardingByCode, code);
  } catch (error) {
    return null;
  }
}
function* continueActionOnboarding() {
  const { step, userSelected, otherInput } = yield select(
    (state: RootState) => state.onboardingState
  );

  let userSelectedValue = userSelected;
  if (isValidStringJson(userSelected)) {
    userSelectedValue = [...JSON.parse(userSelected)];
    if (userSelected.includes("otherInput")) {
      if (otherInput.trim() === "") {
        toast.error("Please enter your other value");
        return;
      }
      if (otherInput.trim().length > 50) {
        toast.error("Please enter a value less than 50 characters");
        return;
      }
      userSelectedValue = userSelectedValue.filter((item: string) => item !== "otherInput");
      userSelectedValue.push(otherInput.trim());
      // userSelectedValue = JSON.stringify(userSelectedValue);
    }
  }

  yield call(updateKeyOnboarding, step.code, userSelectedValue);
  yield put(onboardingActions.setUserSelected(""));
  yield put(onboardingActions.setOtherInput(""));
  yield put(onboardingActions.getStatusOnboarding());
}
function* updateKeyOnboarding(key: string, value: string) {
  try {
    const { data } = yield call(dashboardApi.updateKeyOnboarding, key, value);
    return data;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
}
function* getStatusOnboarding() {
  try {
    const { data } = yield call(dashboardApi.getStatusOnboarding);
    yield call(setDataOnboarding, data);
  } catch (error) {
    yield put(onboardingActions.setLoading(false));
  }
}
function* setDataOnboarding(data: any) {
  try {
    const { process, current, next, done, previous, itemStatus } = data;
    yield put(onboardingActions.setItemStatus(itemStatus));
    if (current) {
      const { content, title, description, template } = current;
      yield put(onboardingActions.setTitle(title));
      yield put(onboardingActions.setDescription(description));
      yield put(onboardingActions.setContent(content));
      yield put(onboardingActions.setTemplate(template));
      yield put(onboardingActions.setStep(current));
    }
    if (next) {
      yield put(onboardingActions.setNextCode(get(next, "code", null)));
    }
    if (previous) {
      yield put(onboardingActions.setPreviousCode(get(previous, "code", null)));
    }

    yield put(onboardingActions.setProcessOnboarding(process));
    yield put(onboardingActions.setDone(done));
    yield put(onboardingActions.setLoading(false));
  } catch (error) {
    //  Error log
  }
}
