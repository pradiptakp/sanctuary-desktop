import {createReducer} from "typesafe-actions";
import {UserData} from "../../types";
import {AuthAction} from "../actions/actionTypes";
import {postLogout, setUser} from "../actions/authActions";
import { RootState } from "../store";

export interface AuthState {
  user?: UserData | undefined;
}

const initialState: AuthState = {
  user: undefined,
};

export const tokenSelector = (state: RootState) => ({token: state.auth.user?.access_token, keyrockToken : state.auth.user?.keyrockToken});

const authReducer = createReducer<AuthState, AuthAction>(initialState)
  .handleAction(setUser, (state, action) => ({
    ...state,
    user: action.payload,
  }))
  .handleAction(postLogout, state => ({
    ...state,
    user: undefined,
  }));

export default authReducer;
