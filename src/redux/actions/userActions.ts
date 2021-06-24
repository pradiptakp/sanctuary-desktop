import {createAsyncAction} from "typesafe-actions";
import {User} from "../../types";

export const getUsers = createAsyncAction(
  "GET_USERS_REQUEST",
  "GET_USERS_SUCCESS",
  "GET_USERS_ERROR",
)<
  {
    onSuccess: (res: User[]) => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();

export const deleteUser = createAsyncAction(
  "DELETE_USER_REQUEST",
  "DELETE_USER_SUCCESS",
  "DELETE_USER_ERROR",
)<
  {
    id: string;
    onSuccess: () => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();

export const getUser = createAsyncAction("GET_USER_REQUEST", "GET_USER_SUCCESS", "GET_USER_ERROR")<
  {
    id: string;
    onSuccess: (res: User) => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();

export const updateUser = createAsyncAction(
  "UPDATE_USER_REQUEST",
  "UPDATE_USER_SUCCESS",
  "UPDATE_USER_ERROR",
)<
  {
    id: string;
    data: {
      username?: string;
      password?: string;
      isAdmin?: boolean;
    };
    onSuccess: () => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();

export const postUser = createAsyncAction(
  "POST_USER_REQUEST",
  "POST_USER_SUCCESS",
  "POST_USER_ERROR",
)<
  {
    data: {
      username: string;
      email: string;
      password: string;
    };
    onSuccess: () => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();
