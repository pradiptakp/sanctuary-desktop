import appReducer, { AppReducerState } from "./reducers/appReducer";
import authReducer, { AuthState } from "./reducers/authReducer";
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Dispatch,
  MiddlewareAPI,
} from "redux";
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import { RootAction } from "./actions/actionTypes";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";

/*
 *--------------------------------------------------*
 * Persist config documentation
 * https://github.com/rt2zz/redux-persist/blob/master/src/types.js#L13-L27
 *--------------------------------------------------*
 */

const appPersistConfig: PersistConfig<
  AppReducerState,
  unknown,
  unknown,
  unknown
> = {
  key: "app",
  storage: storage,
};

const authPersistConfig: PersistConfig<AuthState, unknown, unknown, unknown> = {
  storage: storage,
  key: "auth",
};

export const reducers = {
  app: persistReducer(appPersistConfig, appReducer),
  auth: persistReducer(authPersistConfig, authReducer),
};

export const rootReducer = combineReducers(reducers);
export type RootState = ReturnType<typeof rootReducer>;

const sagaMiddleware = createSagaMiddleware();

const appMiddleware =
  (_store: MiddlewareAPI) => (next: Dispatch) => (action: RootAction) => {
    //   var state = store.getState()
    //   switch (action.type) {
    //     case actions.ADD_TASK:
    //       *do something*
    //       break;
    //   }
    next(action);
  };

const middlewares = [appMiddleware, sagaMiddleware];
const enhancers = [applyMiddleware(...middlewares)];

export const store = createStore(rootReducer, compose(...enhancers));

sagaMiddleware.run(rootSaga);
export const persistor = persistStore(store as any);

/*
 *--------------------------------------------------*
 * Reset persist store: persistor.purge()
 *--------------------------------------------------*
 */
