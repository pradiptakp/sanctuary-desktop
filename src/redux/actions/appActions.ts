import {createAction, createAsyncAction} from "typesafe-actions";
import {DashboardData} from "../../types";
import {AppReducerState} from "../reducers/appReducer";

/**
 * Shallow merge new state with current app reducer state and initial state
 * Useful to update persistor state when reducer has new params
 *
 * @param state params of the app reducer
 */
export const setStoreState = createAction(
  "APP_SET_STORE_STATE",
  (state: Partial<AppReducerState>) => state,
)();

export const setHostUrl = createAction("APP_SET_HOST_URL", (hostUrl: string) => hostUrl)();

export const toggleDarkMode = createAction("TOGGLE_DARK_MODE", (dark: boolean) => dark)();

export const getDashboardInfo = createAsyncAction(
  "GET_DASHBOARD",
  "GET_DASHBOARD_SUCCESS",
  "GET_DASHBOARD_ERROR",
)<
  {
    onSuccess: (res: DashboardData) => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();
