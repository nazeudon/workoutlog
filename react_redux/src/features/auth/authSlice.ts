import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_AUTHEN } from "../types";

// .envファイルにパスを指定
// process.envにつなぐことでパスとして認識してくれる
const apiUrl = process.env.REACT_APP_DEV_API_URL;

//ログイン
export const fetchAsyncLogin = createAsyncThunk(
  "auth/login",
  async (authen: PROPS_AUTHEN) => {
    const res = await axios.post(`${apiUrl}/authen/jwt/create`, authen, {
      headers: {
        "Content-Type": "application/json", //postの場合指定する
      },
    });
    return res.data; //jwtトークンが返り値
  }
);

//新規ユーザ
export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: PROPS_AUTHEN) => {
    const res = await axios.post(`${apiUrl}/api/register/`, auth, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    openSignIn: true, //モーダル表示/非表示
    openSignUp: false, //モーダル表示/非表示
    isLoadingAuth: false, //apiにアクセス中か否か
    isJwt: false,
  },
  reducers: {
    //apiへのfetchを開始したとき
    fetchCredStart(state) {
      state.isLoadingAuth = true;
    },
    //apiへのfetchを終了したとき
    fetchCredEnd(state) {
      state.isLoadingAuth = false;
    },
    setOpenSignIn(state) {
      state.openSignIn = true;
    },
    resetOpenSignIn(state) {
      state.openSignIn = false;
    },
    setOpenSignUp(state) {
      state.openSignUp = true;
    },
    resetOpenSignUp(state) {
      state.openSignUp = false;
    },

    setIsJwt(state) {
      state.isJwt = true;
    },
    resetIsJwt(state) {
      state.isJwt = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem("localJWT", action.payload.access);
    });
  },
});

export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  setIsJwt,
  resetIsJwt,
} = authSlice.actions;

export const selectIsLoadingAuth = (state: RootState) =>
  state.auth.isLoadingAuth;
export const selectIsJwt = (state: RootState) => state.auth.isJwt;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;

export default authSlice.reducer;
