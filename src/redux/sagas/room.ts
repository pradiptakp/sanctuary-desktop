import {select, takeLatest} from "redux-saga/effects";
import axios, {AxiosResponse} from "axios";
import {deleteRoom, getRoom, getRooms, postRoom, updateRoom} from "../actions/roomActions";
import {INDEX_ROOM, STORE_ROOM, DELETE_ROOM, UPDATE_ROOM} from "../../apis";
import {Room} from "../../types";
import {hostUrlSelector} from "../reducers/appReducer";
import {tokenSelector} from "../reducers/authReducer";

function* getRoomsSaga({payload}: ReturnType<typeof getRooms.request>) {
  try {
    const {keyrockToken, token}: {token: string; keyrockToken: string} = yield select(
      tokenSelector,
    );
    const hostUrl: string = yield select(hostUrlSelector);
    const response: AxiosResponse<Room[]> = yield axios.get(hostUrl + INDEX_ROOM, {
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

function* getRoomSaga({payload}: ReturnType<typeof getRoom.request>) {
  try {
    const {keyrockToken, token}: {token: string; keyrockToken: string} = yield select(
      tokenSelector,
    );
    const hostUrl: string = yield select(hostUrlSelector);
    const response: AxiosResponse<Room> = yield axios.get(`${hostUrl + INDEX_ROOM}/${payload.id}`, {
      headers: {
        "X-Auth-Token": token,
        "X-Keyrock-Token": keyrockToken,
      },
    });
    payload.onSuccess(response.data);
  } catch (err) {
    console.log(err);
    payload.onFailure(err);
  }
}

function* postRoomSaga({payload}: ReturnType<typeof postRoom.request>) {
  try {
    const {keyrockToken, token}: {token: string; keyrockToken: string} = yield select(
      tokenSelector,
    );
    const hostUrl: string = yield select(hostUrlSelector);
    yield axios.post(hostUrl + STORE_ROOM, payload.data, {
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

function* updateRoomSaga({payload}: ReturnType<typeof updateRoom.request>) {
  try {
    const {keyrockToken, token}: {token: string; keyrockToken: string} = yield select(
      tokenSelector,
    );
    const hostUrl: string = yield select(hostUrlSelector);
    yield axios.put(hostUrl + UPDATE_ROOM + payload.id, payload.data, {
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

function* deleteRoomSaga({payload}: ReturnType<typeof deleteRoom.request>) {
  try {
    const {keyrockToken, token}: {token: string; keyrockToken: string} = yield select(
      tokenSelector,
    );
    const hostUrl: string = yield select(hostUrlSelector);
    yield axios.delete(hostUrl + DELETE_ROOM + payload.id, {
      headers: {
        "X-Auth-Token": token,
        "X-Keyrock-Token": keyrockToken,
      },
    });

    payload.onSuccess();
  } catch (err: any) {
    console.log(err);
    payload.onFailure(err.response.data);
  }
}

export default function* room() {
  yield takeLatest(getRooms.request, getRoomsSaga);
  yield takeLatest(getRoom.request, getRoomSaga);
  yield takeLatest(postRoom.request, postRoomSaga);
  yield takeLatest(updateRoom.request, updateRoomSaga);
  yield takeLatest(deleteRoom.request, deleteRoomSaga);
}
