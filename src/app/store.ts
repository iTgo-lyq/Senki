import {
  Action,
  configureStore,
  ThunkAction,
  combineReducers,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import appSlice from "./appSlice";

const rootReducer = combineReducers({
  app: appSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export default store;
