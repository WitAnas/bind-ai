import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  api_keys: {},
  errors: "",
  loading: false,
};

export const fetchUserApiKeys = createAsyncThunk(
  "userApiKeys/fetch",
  async (userId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEW_BACKEND_URL}/user_key?user_id=${userId}`
      );

      return response?.data;
    } catch (error) {
      console.log("Error fetching user key API:", error);
      throw error;
    }
  }
);

export const deleteUserApiKey = createAsyncThunk(
  "userApiKeys/delete",
  async ({ userId, providerName }) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_NEW_BACKEND_URL}/user_key?user_id=${userId}&provider_name=${providerName}`
      );
      return providerName;
    } catch (error) {
      console.log("Error deleting user API key:", error);
      throw error;
    }
  }
);

const userApiKeysSlice = createSlice({
  name: "userApiKeys",
  initialState,
  reducers: {
    clearUserApiKeys: (state) => {
      state.api_keys = {};
      state.errors = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserApiKeys.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserApiKeys.fulfilled, (state, { payload }) => {
        state.loading = false;

        if (payload?.error) {
          state.errors = payload.error;
        } else {
          state.api_keys = payload;
        }
      })
      .addCase(fetchUserApiKeys.rejected, (state, action) => {
        state.loading = false;
        state.errors = "Failed to fetch user API keys.";
      })
      .addCase(deleteUserApiKey.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserApiKey.fulfilled, (state, { payload }) => {
        state.loading = false;
        delete state.api_keys[payload];
      })
      .addCase(deleteUserApiKey.rejected, (state, action) => {
        state.loading = false;
        console.log("Error deleting user API key:", action.error);
        state.errors = "Failed to delete user API key.";
      });
  },
});

export const { clearUserApiKeys } = userApiKeysSlice.actions;

export default userApiKeysSlice.reducer;
