import {createAsyncAction} from "typesafe-actions";
import {Room} from "../../types";

export const getRooms = createAsyncAction(
  "GET_ROOMS_REQUEST",
  "GET_ROOMS_SUCCESS",
  "GET_ROOMS_ERROR",
)<
  {
    onSuccess: (res: Room[]) => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();

export const deleteRoom = createAsyncAction(
  "DELETE_ROOM_REQUEST",
  "DELETE_ROOM_SUCCESS",
  "DELETE_ROOM_ERROR",
)<
  {
    id: string;
    onSuccess: () => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();

export const getRoom = createAsyncAction("GET_ROOM_REQUEST", "GET_ROOM_SUCCESS", "GET_ROOM_ERROR")<
  {
    id: string;
    onSuccess: (res: Room) => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();

export const updateRoom = createAsyncAction(
  "UPDATE_ROOM_REQUEST",
  "UPDATE_ROOM_SUCCESS",
  "UPDATE_ROOM_ERROR",
)<
  {
    id: string;
    data: {
      name?: string;
      description?: string;
    };
    onSuccess: () => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();

export const postRoom = createAsyncAction(
  "POST_ROOM_REQUEST",
  "POST_ROOM_SUCCESS",
  "POST_ROOM_ERROR",
)<
  {
    data: {
      name: string;
      description: string;
    };
    onSuccess: () => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();
