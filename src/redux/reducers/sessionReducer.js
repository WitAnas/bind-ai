import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  sessions: {},
  loading: false,
  error: null,
  toggledState: false,
};

export const fetchSessionList = createAsyncThunk(
  "sessions/fetchList",
  async ({ userId, botId }, { rejectWithValue }) => {
    try {
      let formData = new FormData();
      formData.append("botId", botId);
      formData.append("userId", userId);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/sessionList",
        formData
      );

      return { botId, data: response?.data };
    } catch (error) {
      console.log("Error fetching session list:", error);
      return rejectWithValue({ error: error.message, botId });
    }
  }
);

export const sessionReducer = createSlice({
  name: "session",
  initialState,
  reducers: {
    setCurrentSessionId: (state, action) => {
      const { botId, sessionId } = action.payload;

      if (!state.sessions[botId]) {
        state.sessions[botId] = { list: [], currentSessionId: null };
      }
      state.sessions[botId].currentSessionId = sessionId;
      const botData = JSON.parse(localStorage.getItem(botId)) || {};
      botData.sessionKey = sessionId;
      localStorage.setItem(botId, JSON.stringify(botData));
    },
    clearSessions: (state, action) => {
      const { botId } = action.payload;
      if (botId) {
        delete state.sessions[botId];
      } else {
        state.sessions = {};
      }
    },
    createNewSession: (state, action) => {
      const { botId } = action.payload;
      const newSessionKey = Math.random().toString(36).substring(2, 15);
      const botData = JSON.parse(localStorage.getItem(botId)) || {};
      botData.sessionKey = newSessionKey;
      localStorage.setItem(botId, JSON.stringify(botData));
      if (!state.sessions[botId]) {
        state.sessions[botId] = { list: [], currentSessionId: null };
      }

      const newSession = {
        sessionKey: newSessionKey,
        summary: "New chat",
      };
      state.sessions[botId].list.unshift(newSession);
      state.sessions[botId].currentSessionId = newSessionKey;
    },
    toggleState: (state) => {
      state.toggledState = !state.toggledState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSessionList.fulfilled, (state, { payload }) => {
        state.loading = false;
        const { botId, data } = payload;

        if (data?.status === "success") {
          state.error = null;
          if (!state.sessions[botId]) {
            state.sessions[botId] = { list: [], currentSessionId: null };
          }

          state.sessions[botId].list = Object.values(data.sessionData);

          const currentSessionId = state.sessions[botId].currentSessionId;

          const sessionExists = state.sessions[botId].list.some(
            (session) => session.sessionKey === currentSessionId
          );

          if (currentSessionId && !sessionExists) {
            const newSession = {
              sessionKey: currentSessionId,
              summary: "New chat",
            };
            state.sessions[botId].list.unshift(newSession);
          } else if (
            !currentSessionId &&
            state.sessions[botId].list.length > 0
          ) {
            state.sessions[botId].currentSessionId =
              state.sessions[botId].list[0].sessionKey;
          }
        } else {
          state.error = `Failed to fetch session list for bot ${botId}`;
        }
      })
      .addCase(fetchSessionList.rejected, (state, action) => {
        state.loading = false;
        state.error = "Error fetching session list";
        const { botId } = action.meta.arg;

        if (!state.sessions[botId]) {
          state.sessions[botId] = { list: [], currentSessionId: null };
        }
        const currentSessionId = state.sessions[botId].currentSessionId;
        if (currentSessionId) {
          const newSession = {
            sessionKey: currentSessionId,
            summary: "New chat",
          };

          state.sessions[botId].list = [newSession];
        } else {
          state.sessions[botId].list = [];
        }
      });
  },
});

export const {
  setCurrentSessionId,
  clearSessions,
  createNewSession,
  toggleState,
} = sessionReducer.actions;
export default sessionReducer.reducer;
