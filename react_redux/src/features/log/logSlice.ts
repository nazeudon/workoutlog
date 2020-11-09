import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_LOG } from "../types";

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

const initialState: PROPS_LOG = {
  openNewLog: false, //新ログ追加用のモーダル
  logs: [
    {
      id: 0,
      userLog: 0,
      created_on: "",
      event: 0,
    },
  ],
};

export const logSlice = createSlice({
  name: "log",
  initialState: initialState,
  reducers: {
    setOpenNewLog(state) {
      state.openNewLog = true;
    },
    resetOpenNewLog(state) {
      state.openNewLog = false;
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

export const { setOpenNewLog, resetOpenNewLog } = logSlice.actions;

export const selectOpenNewLog = (state: RootState) => state.log.openNewLog;
export const selectLogs = (state: RootState) => state.log.logs;

export default logSlice.reducer;
