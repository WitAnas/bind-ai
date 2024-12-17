import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  initialBotMessage: "",
  latestModel: {},
  currentBotId: null,
  loading: false,
  bots: [],
  customUserBot: null,
  error: "",
};

export const fetchUserBots = createAsyncThunk("bots/fetch", async (userId) => {
  try {
    let formData = new FormData();
    formData.append("userId", userId);
    const response = await axios.post(
      process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/bot",
      formData
    );
    return response?.data;
  } catch (error) {
    console.log("Error fetching users bot:", error);
    throw error;
  }
});

export const botReducer = createSlice({
  name: "bot",
  initialState,
  reducers: {
    setBotMessage: (state, action) => {
      state.initialBotMessage = action.payload;
    },
    clearBotMessage: (state) => {
      state.initialBotMessage = "";
    },
    setLatestModel: (state, action) => {
      state.latestModel = action.payload;
    },
    setCurrentBotId: (state, action) => {
      state.currentBotId = action.payload;
    },
    clearCustomBots: (state) => {
      state.bots = [];
    },
    setCustomUserBot: (state, action) => {
      state.customUserBot = action.payload;
    },
    clearCustomUserBot: (state) => {
      state.customUserBot = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBots.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserBots.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload?.status === "error") {
          state.error = payload.status;
        } else {
          state.bots = payload?.bots;
        }
      })
      .addCase(fetchUserBots.rejected, (state, action) => {
        state.loading = false;
        console.error("Error fetching user bots:", action.error);
        state.error = "Failed to fetch user bots data.";
      });
  },
});

export const {
  setBotMessage,
  clearBotMessage,
  setLatestModel,
  setCurrentBotId,
  clearCustomBots,
  setCustomUserBot,
  clearCustomUserBot,
} = botReducer.actions;
export default botReducer.reducer;
