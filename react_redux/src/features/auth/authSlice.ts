import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_AUTHEN, PROPS_USERNAME } from "../types";

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

//プロフィール作成
export const fetchAsyncCreateProf = createAsyncThunk(
  "profile/post",
  async (userName: PROPS_USERNAME) => {
    const res = await axios.post(`${apiUrl}/api/profile/`, userName, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

//ログインユーザの取得
export const fetchAsyncGetMyProf = createAsyncThunk(
  "myprofile/get",
  async () => {
    const res = await axios.get(`${apiUrl}/api/myprofile/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data[0];
  }
);

const initialMyProfile = {
  id: 0,
  userProfile: 0,
  created_on: "",
};

const initialState = {
  openSignIn: true, //モーダル表示/非表示
  openSignUp: false, //モーダル表示/非表示
  isLoadingAuth: false, //apiにアクセス中か否か
  isJwt: false,
  myProfile: initialMyProfile,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
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
    resetMyProfile(state) {
      state.myProfile = initialMyProfile;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem("localJWT", action.payload.access);
    });
    builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
      state.myProfile = action.payload;
    });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.myProfile = action.payload;
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
  resetMyProfile,
} = authSlice.actions;

export const selectIsLoadingAuth = (state: RootState) =>
  state.auth.isLoadingAuth;
export const selectIsJwt = (state: RootState) => state.auth.isJwt;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;
export const selectMyProfile = (state: RootState) => state.auth.myProfile;

export default authSlice.reducer;
