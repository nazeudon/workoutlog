import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_NEWEVENT } from "../types";

const apiUrlEvent = `${process.env.REACT_APP_DEV_API_URL}/api/event/`;

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

const initialEvents = [
  {
    id: 0,
    title: "",
    userEvent: 0,
    img: "",
  },
];

const initialState = {
  isLoadingEvent: false,
  openNewEvent: false, //新種目追加用のモーダル
  selectedEventId: 0,
  selectedEventTitle: "",
  events: initialEvents,
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
    resetEvents(state) {
      state.events = initialEvents;
    },
    fetchSetSelectedEventId(state, action) {
      state.selectedEventId = action.payload;
    },
    fetchResetSelectedEventId(state) {
      state.selectedEventId = 0;
    },
    fetchSetSelectedEventTitle(state, action) {
      state.selectedEventTitle = action.payload;
    },
    fetchResetSelectedEventTitle(state) {
      state.selectedEventTitle = "";
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
        events: [...state.events, action.payload],
      };
    });
  },
});

export const {
  fetchPostStart,
  fetchPostEnd,
  setOpenNewEvent,
  resetOpenNewEvent,
  resetEvents,
  fetchSetSelectedEventId,
  fetchResetSelectedEventId,
  fetchSetSelectedEventTitle,
  fetchResetSelectedEventTitle,
} = eventSlice.actions;

export const selectIsLoadingEvent = (state: RootState) =>
  state.event.isLoadingEvent;
export const selectOpenNewEvent = (state: RootState) =>
  state.event.openNewEvent;
export const selectEvents = (state: RootState) => state.event.events;
export const selectSelectedEventId = (state: RootState) =>
  state.event.selectedEventId;
export const selectSelectedEventTitle = (state: RootState) =>
  state.event.selectedEventTitle;

export default eventSlice.reducer;
