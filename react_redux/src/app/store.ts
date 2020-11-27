import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import eventReducer from "../features/event/eventSlice";
import logReducer from "../features/log/logSlice";
import detailRedecer from "../features/detail/detailSlice";
import plotResucer from "../features/plot/plotSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    log: logReducer,
    detail: detailRedecer,
    plot: plotResucer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// store.dispatchの型を踏襲する
export type AppDispatch = typeof store.dispatch;
