import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_NEWDETAIL, PROPS_UPDATEDETAIL } from "../types";

const apiUrlDetail = `${process.env.REACT_APP_DEV_API_URL}/api/detail/`;

//存在するworkout詳細の取得
export const fetchAsyncGetDetails = createAsyncThunk("detail/get", async () => {
  const res = await axios.get(apiUrlDetail, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

//新規workoutの作成
export const fetchAsyncNewDetail = createAsyncThunk(
  "detail/post",
  async (newDetail: PROPS_NEWDETAIL) => {
    const uploadData = new FormData();
    uploadData.append("weight", String(newDetail.weight));
    uploadData.append("times", String(newDetail.times));
    uploadData.append("event", String(newDetail.event));
    uploadData.append("log", String(newDetail.log));
    const res = await axios.post(apiUrlDetail, uploadData, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

//workoutの編集
export const fetchAsyncUpdateDetail = createAsyncThunk(
  "detail/put",
  async (updateDetail: PROPS_UPDATEDETAIL) => {
    const uploadData = new FormData();
    uploadData.append("weight", String(updateDetail.weight));
    uploadData.append("times", String(updateDetail.times));
    uploadData.append("event", String(updateDetail.event));
    uploadData.append("log", String(updateDetail.log));
    const res = await axios.put(
      `${apiUrlDetail}${updateDetail.detailId}/`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

const initialDetails = [
  {
    id: 0,
    weight: 0.0,
    times: 0,
    userDetail: 0,
    event: 0,
    log: 0,
  },
];

const initialState = {
  openDetail: false, //既存試技閲覧用のモーダル
  openNewDetail: false, //新試技追加用のモーダル
  details: initialDetails,
};

export const detailSlice = createSlice({
  name: "detail",
  initialState: initialState,
  reducers: {
    setOpenDetail(state) {
      state.openDetail = true;
    },
    resetOpenDetail(state) {
      state.openDetail = false;
    },
    setOpenNewDetail(state) {
      state.openNewDetail = true;
    },
    resetOpenNewDetail(state) {
      state.openNewDetail = false;
    },
    resetDetails(state) {
      state.details = initialDetails;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetDetails.fulfilled, (state, action) => {
      return {
        ...state,
        details: action.payload,
      };
    });
    builder.addCase(fetchAsyncNewDetail.fulfilled, (state, action) => {
      return {
        ...state,
        details: [...state.details, action.payload],
      };
    });
    builder.addCase(fetchAsyncUpdateDetail.fulfilled, (state, action) => {
      state.details = state.details.map((detail) =>
        detail.id === action.payload.id ? action.payload : detail
      );
    });
  },
});

export const {
  setOpenDetail,
  resetOpenDetail,
  setOpenNewDetail,
  resetOpenNewDetail,
  resetDetails,
} = detailSlice.actions;

export const selectOpenDetail = (state: RootState) => state.detail.openDetail;
export const selectOpenNewDetail = (state: RootState) =>
  state.detail.openNewDetail;
export const selectDetails = (state: RootState) => state.detail.details;

export default detailSlice.reducer;
