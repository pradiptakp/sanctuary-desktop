import {select, takeLatest} from "redux-saga/effects";
import axios, {AxiosResponse} from "axios";
import {
  deleteDevice,
  getDevices,
  postDevice,
  switchDevice,
  updateDevice,
} from "../actions/deviceActions";
import {DELETE_DEVICE, INDEX_DEVICE, STORE_DEVICE, SWITCH_DEVICE, UPDATE_DEVICE} from "../../apis";
import {Device} from "../../types";
import {hostUrlSelector} from "../reducers/appReducer";
import {tokenSelector} from "../reducers/authReducer";

function* getDevicesSaga({payload}: ReturnType<typeof getDevices.request>) {
  try {
    const {keyrockToken, token}: {token: string; keyrockToken: string} = yield select(
      tokenSelector,
    );
    const hostUrl: string = yield select(hostUrlSelector);
    const response: AxiosResponse<Device[]> = yield axios.get(hostUrl + INDEX_DEVICE, {
      headers: {
        "X-Auth-Token": token,
        "X-Keyrock-Token": keyrockToken,
      },
    });

    payload.onSuccess(response.data);
  } catch (err) {
    console.log(err);
    payload.onFailure();
  }
}

function* postDeviceSaga({payload}: ReturnType<typeof postDevice.request>) {
  try {
    const {keyrockToken, token}: {token: string; keyrockToken: string} = yield select(
      tokenSelector,
    );
    const hostUrl: string = yield select(hostUrlSelector);
    yield axios.post(hostUrl + STORE_DEVICE, payload.data, {
      headers: {
        "X-Auth-Token": token,
        "X-Keyrock-Token": keyrockToken,
      },
    });

    payload.onSuccess();
  } catch (err) {
    console.log(err);
    payload.onFailure();
  }
}

function* updateDeviceSaga({payload}: ReturnType<typeof updateDevice.request>) {
  try {
    const {keyrockToken, token}: {token: string; keyrockToken: string} = yield select(
      tokenSelector,
    );
    const hostUrl: string = yield select(hostUrlSelector);
    yield axios.put(hostUrl + UPDATE_DEVICE, payload.data, {
      headers: {
        "X-Auth-Token": token,
        "X-Keyrock-Token": keyrockToken,
      },
    });

    payload.onSuccess();
  } catch (err) {
    console.log(err);
    payload.onFailure();
  }
}

function* deleteDeviceSaga({payload}: ReturnType<typeof deleteDevice.request>) {
  try {
    const {keyrockToken, token}: {token: string; keyrockToken: string} = yield select(
      tokenSelector,
    );
    const hostUrl: string = yield select(hostUrlSelector);
    yield axios.delete(hostUrl + DELETE_DEVICE + payload.id, {
      headers: {
        "X-Auth-Token": token,
        "X-Keyrock-Token": keyrockToken,
      },
    });

    payload.onSuccess();
  } catch (err) {
    console.log(err);
    payload.onFailure();
  }
}

function* switchDeviceSaga({payload}: ReturnType<typeof switchDevice.request>) {
  try {
    const {keyrockToken, token}: {token: string; keyrockToken: string} = yield select(
      tokenSelector,
    );
    const hostUrl: string = yield select(hostUrlSelector);
    yield axios.post(hostUrl + SWITCH_DEVICE + payload.id, payload.data, {
      headers: {
        "X-Auth-Token": token,
        "X-Keyrock-Token": keyrockToken,
      },
    });

    payload.onSuccess();
  } catch (err) {
    console.log(err);
    payload.onFailure();
  }
}
export default function* device() {
  yield takeLatest(getDevices.request, getDevicesSaga);
  yield takeLatest(postDevice.request, postDeviceSaga);
  yield takeLatest(updateDevice.request, updateDeviceSaga);
  yield takeLatest(switchDevice.request, switchDeviceSaga);
  yield takeLatest(deleteDevice.request, deleteDeviceSaga);
}
