import {createAsyncAction} from "typesafe-actions";
import {Device, DeviceType} from "../../types";

export const getDevices = createAsyncAction(
  "GET_DEVICES_REQUEST",
  "GET_DEVICES_SUCCESS",
  "GET_DEVICES_ERROR",
)<
  {
    onSuccess: (res: Device[]) => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();

export const getDevice = createAsyncAction(
  "GET_DEVICE_REQUEST",
  "GET_DEVICE_SUCCESS",
  "GET_DEVICE_ERROR",
)<
  {
    id: string;
    onSuccess: (res: Device) => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();

export const deleteDevice = createAsyncAction(
  "DELETE_DEVICE_REQUEST",
  "DELETE_DEVICE_SUCCESS",
  "DELETE_DEVICE_ERROR",
)<
  {
    id: string;
    onSuccess: () => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();

export const updateDevice = createAsyncAction(
  "UPDATE_DEVICE_REQUEST",
  "UPDATE_DEVICE_SUCCESS",
  "UPDATE_DEVICE_ERROR",
)<
  {
    id: string;
    data: {
      type: DeviceType;
    };
    onSuccess: () => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();

export const postDevice = createAsyncAction(
  "POST_DEVICE_REQUEST",
  "POST_DEVICE_SUCCESS",
  "POST_DEVICE_ERROR",
)<
  {
    data: {
      type: DeviceType;
      roomId: string;
    };
    onSuccess: () => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();

export const switchDevice = createAsyncAction(
  "SWITCH_DEVICE_REQUEST",
  "SWITCH_DEVICE_SUCCESS",
  "SWITCH_DEVICE_ERROR",
)<
  {
    id: string;
    data: {
      state: boolean;
    };
    onSuccess: () => void;
    onFailure: (err?: any) => void;
  },
  any,
  any
>();
