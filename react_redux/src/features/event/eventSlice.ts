import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_NEWEVENT, PROPS_EVENT } from "../types";

const apiUrlEvent = `${process.env.REACT_APP_DEV_API_URL}/api/post/`;

//存在するイベント(種目)の取得
export const fetchAsyncGetEvents = createAsyncThunk("event/get", async () => {
  const res = await axios.get(apiUrlEvent, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

// 新規イベント(種目)作成
export const fetchAsyncNewEvent = createAsyncThunk(
  "event/post",
  async (newEvent: PROPS_NEWEVENT) => {
    const uploadData = new FormData();
    uploadData.append("title", newEvent.title);
    newEvent.img && uploadData.append("img", newEvent.img, newEvent.img.name);
    const res = await axios.post(apiUrlEvent, uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

const initialState: PROPS_EVENT = {
  isLoadingEvent: false,
  openNewEvent: false, //新種目追加用のモーダル
  events: [
    {
      id: 0,
      title: "",
      userEvent: 0,
      img: null,
    },
  ],
};

export const eventSlice = createSlice({
  name: "event",
  initialState: initialState,
  reducers: {
    fetchPostStart(state) {
      state.isLoadingEvent = true;
    },
    fetchPostEnd(state) {
      state.isLoadingEvent = false;
    },
    setOpenNewEvent(state) {
      state.openNewEvent = true;
    },
    resetOpenNewEvent(state) {
      state.openNewEvent = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetEvents.fulfilled, (state, action) => {
      return {
        ...state,
        events: action.payload,
      };
    });
    builder.addCase(fetchAsyncNewEvent.fulfilled, (state, action) => {
      return {
        ...state,
        posts: [...state.events, action.payload],
      };
    });
  },
});

export const {
  fetchPostStart,
  fetchPostEnd,
  setOpenNewEvent,
  resetOpenNewEvent,
} = eventSlice.actions;

export const selectIsLoadingEvent = (state: RootState) =>
  state.event.isLoadingEvent;
export const selectOpenNewEvent = (state: RootState) =>
  state.event.openNewEvent;
export const selectEvents = (state: RootState) => state.event.events;

export default eventSlice.reducer;
