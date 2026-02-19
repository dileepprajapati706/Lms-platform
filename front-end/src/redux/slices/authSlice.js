import { createSlice } from "@reduxjs/toolkit";

const userFromStorage = localStorage.getItem("lms_user")
  ? JSON.parse(localStorage.getItem("lms_user"))
  : null;

const tokenFromStorage = localStorage.getItem("lms_token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage,
    token: tokenFromStorage,
    isAuthenticated: !!tokenFromStorage,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("lms_user", JSON.stringify(action.payload.user));
      localStorage.setItem("lms_token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("lms_user");
      localStorage.removeItem("lms_token");
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("lms_user", JSON.stringify(state.user));
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;