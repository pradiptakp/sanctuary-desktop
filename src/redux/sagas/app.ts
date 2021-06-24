import {select, takeLatest} from "redux-saga/effects";
import axios, {AxiosResponse} from "axios";
import {GET_DASHBOARD_INFO} from "../../apis";
import {getDashboardInfo} from "../actions/appActions";
import {DashboardData} from "../../types";
import {hostUrlSelector} from "../reducers/appReducer";
import {tokenSelector} from "../reducers/authReducer";

function* getDashboardSaga({payload}: ReturnType<typeof getDashboardInfo.request>) {
  try {
    const {keyrockToken, token}: {token: string; keyrockToken: string} = yield select(
      tokenSelector,
    );
    const hostUrl: string = yield select(hostUrlSelector);
    const response: AxiosResponse<DashboardData> = yield axios
      .get<DashboardData>(hostUrl + GET_DASHBOARD_INFO, {
        headers: {
          "X-Auth-Token": token,
          "X-Keyrock-Token": keyrockToken,
        },
      })
      .then((res) => res);

    payload.onSuccess(response.data);
  } catch (err) {
    console.log(err);
    payload.onFailure();
  }
}

export default function* app() {
  yield takeLatest(getDashboardInfo.request, getDashboardSaga);
}
