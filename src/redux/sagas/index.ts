import { all } from "redux-saga/effects";
import app from "./app";
import auth from "./auth";
import device from "./device";
import room from "./room";
import user from "./user";

export default function* root() {
  yield all([app(), auth(), device(), room(), user()]);
}
