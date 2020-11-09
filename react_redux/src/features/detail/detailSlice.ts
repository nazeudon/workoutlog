import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_NEWDETAIL, PROPS_DETAIL } from "../types";

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
  async (detail: PROPS_NEWDETAIL) => {
    const res = await axios.post(apiUrlDetail, detail, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

const initialState: PROPS_DETAIL = {
  openNewDetail: false, //新試技追加用のモーダル
  details: [
    {
      id: 0,
      weight: 0.0,
      times: 0,
      userDetail: 0,
      log: 0,
    },
  ],
};

export const detailSlice = createSlice({
  name: "detail",
  initialState: initialState,
  reducers: {
    setOpenNewDetail(state) {
      state.openNewDetail = true;
    },
    resetOpenNewDetail(state) {
      state.openNewDetail = false;
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
        posts: [...state.details, action.payload],
      };
    });
  },
});

export const { setOpenNewDetail, resetOpenNewDetail } = detailSlice.actions;

export const selectOpenNewDetail = (state: RootState) =>
  state.detail.openNewDetail;
export const selectDetails = (state: RootState) => state.detail.details;

export default detailSlice.reducer;
