import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

const apiUrlLog = `${process.env.REACT_APP_DEV_API_URL}/api/log/`;

//存在するログの取得
export const fetchAsyncGetLogs = createAsyncThunk("log/get", async () => {
  const res = await axios.get(apiUrlLog, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

//新規ログの作成
export const fetchAsyncNewLog = createAsyncThunk("log/post", async () => {
  const res = await axios.post(apiUrlLog, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

const initialLogs = [
  {
    id: 0,
    userLog: 0,
    created_on: "",
    event: 0,
  },
];

const initialState = {
  openLog: false, //既存データ閲覧のモーダル
  openNewLog: false, //新ログ追加用のモーダル
  selectedLogId: 0,
  logs: initialLogs,
};

export const logSlice = createSlice({
  name: "log",
  initialState: initialState,
  reducers: {
    setOpenLog(state) {
      state.openLog = true;
    },
    resetOpenLog(state) {
      state.openLog = false;
    },
    setOpenNewLog(state) {
      state.openNewLog = true;
    },
    resetOpenNewLog(state) {
      state.openNewLog = false;
    },
    resetLogs(state) {
      state.logs = initialLogs;
    },
    fetchSetSelectedLogId(state, action) {
      state.selectedLogId = action.payload;
    },
    fetchResetSelectedLogId(state) {
      state.selectedLogId = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetLogs.fulfilled, (state, action) => {
      return {
        ...state,
        logs: action.payload,
      };
    });
    builder.addCase(fetchAsyncNewLog.fulfilled, (state, action) => {
      return {
        ...state,
        posts: [...state.logs, action.payload],
      };
    });
  },
});

export const {
  setOpenLog,
  resetOpenLog,
  setOpenNewLog,
  resetOpenNewLog,
  resetLogs,
  fetchSetSelectedLogId,
  fetchResetSelectedLogId,
} = logSlice.actions;

export const selectOpenLog = (state: RootState) => state.log.openLog;
export const selectOpenNewLog = (state: RootState) => state.log.openNewLog;
export const selectLogs = (state: RootState) => state.log.logs;
export const selectSelectedLogId = (state: RootState) =>
  state.log.selectedLogId;

export default logSlice.reducer;
