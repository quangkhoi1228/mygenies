import { put, call } from "redux-saga/effects";
import { setTouchDevice } from "../features/device.slice";

function* checkDeviceType() {
  if (typeof window !== "undefined") {
    const isTouchDevice: boolean = window?.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) {
      yield put(setTouchDevice(true));
    } else {
      yield put(setTouchDevice(false));
    }
  }
}

export function* getDeviceType() {
  yield call(checkDeviceType);
}
