import {put, select, takeLatest} from "redux-saga/effects";
import axios, {AxiosResponse} from "axios";
import {postLogin, setUser} from "../actions/authActions";
import {LOGIN_URL} from "../../apis";
import {UserData} from "../../types";
import {hostUrlSelector} from "../reducers/appReducer";
import {tokenSelector} from "../reducers/authReducer";

function* postLoginSaga({payload}: ReturnType<typeof postLogin.request>) {
  try {
    const {keyrockToken, token}: {token: string; keyrockToken: string} = yield select(
      tokenSelector,
    );
    const hostUrl: string = yield select(hostUrlSelector);
    const response: AxiosResponse<UserData> = yield axios.post(hostUrl + LOGIN_URL, payload.data, {
      headers: {
        "X-Auth-Token": token,
        "X-Keyrock-Token": keyrockToken,
      },
    });

    yield put(setUser(response.data));
    payload.onSuccess(response.data);
  } catch (err) {
    console.log(err);
    payload.onFailure();
  }
}

export default function* auth() {
  yield takeLatest(postLogin.request, postLoginSaga);
}
