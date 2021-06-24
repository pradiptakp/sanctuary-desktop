import {setHostUrl, setStoreState, toggleDarkMode} from "../actions/appActions";
import {createReducer} from "typesafe-actions";
import {AppAction} from "../actions/actionTypes";
import {Device} from "../../types";
import {RootState} from "../store";

export interface AppReducerState {
  version: string;
  dark: boolean;
  recentDevices: Device[];
  hostUrl: string;
}

const initialState: AppReducerState = {
  version: "1.0.0",
  dark: false,
  recentDevices: [],
  hostUrl: "",
};

export const hostUrlSelector = (state: RootState) => state.app.hostUrl;

const appReducer = createReducer<AppReducerState, AppAction>(initialState)
  .handleAction(setStoreState, (state, action) =>
    Object.assign({}, initialState, state, action.payload),
  )
  .handleAction(toggleDarkMode, (state, action) => ({
    ...state,
    dark: action.payload,
  }))
  .handleAction(setHostUrl, (state, action) => ({
    ...state,
    hostUrl: action.payload,
  }));

export default appReducer;
