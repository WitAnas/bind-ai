import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import { fetchUserSubscription } from "./userSubscriptionReducer";

const initialState = {
  currentUser: {},
  errors: "",
  loading: true,
  isLoggedIn: false,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { dispatch }) => {
    let formData = new FormData();
    formData.append("firstname", payload.firstname);
    formData.append("lastname", payload.lastname);
    formData.append("email", payload.email);
    formData.append("userId", payload.userId);
    formData.append("password", payload.password);
    payload.code && formData.append("code", payload.code);

    const response = await axios.post(
      ` ${process.env.NEXT_PUBLIC_NEW_BACKEND_URL}/${
        payload.code ? "appsumo_register" : "register"
      }`,
      formData
    );

    dispatch(fetchUserSubscription(payload.userId));
    return response.data;
  }
);

export const loginUserWithId = createAsyncThunk(
  "auth/loginId",
  async (payload) => {
    let formData = new FormData();
    formData.append("userId", payload.id);
    const response = await axios.post(
      process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/loginId",
      formData
    );
    return response.data;
  }
);

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.currentUser = {};
      state.loading = false;
      state.isLoggedIn = false;
    },
    updateCurrentUser: (state, payload) => {
      state.currentUser = payload?.payload;
      state.loading = false;
    },
    updateIsLoggedIn: (state, payload) => {
      state.isLoggedIn = payload?.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      if (payload.status === "error") {
        state.errors = payload.msg;
        NotificationManager.error("", state.errors, 2000);
      } else {
        // NotificationManager.success("Registration successful. Check your email for verification.");
        // history.navigate("/login");
      }
    });
    builder.addCase(loginUserWithId.fulfilled, (state, { payload }) => {
      if (payload.status === "error") {
        state.errors = payload.msg;
      } else {
        // state.currentUser = payload.user;
        // localStorage.setItem("userId", payload.user.id);
        // NotificationManager.success("Successfully LogedIn!");
        // history.navigate("/createBot/select");
      }
    });
  },
});

export const { setLoading, logout, updateCurrentUser, updateIsLoggedIn } =
  authReducer.actions;
export default authReducer.reducer;
