import {ActionType} from "typesafe-actions";
import * as appActions from "./appActions";
import * as authActions from "./authActions";
import * as roomActions from "./roomActions";
import * as userActions from "./userActions";
import * as deviceActions from "./deviceActions";

export type AppAction = ActionType<typeof appActions>;
export type AuthAction = ActionType<typeof authActions>;
export type RoomActions = ActionType<typeof roomActions>;
export type UserActions = ActionType<typeof userActions>;
export type DeviceActions = ActionType<typeof deviceActions>;

export type RootAction = AppAction | AuthAction;
