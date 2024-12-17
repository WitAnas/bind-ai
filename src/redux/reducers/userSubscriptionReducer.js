import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user_info: null,
  errors: "",
  loading: false,
  run_count: null,
  preferences: {
    theme: "",
  },
  sumo_data: null,
};

export const fetchUserSubscription = createAsyncThunk(
  "userSubscription/fetch",
  async (userId) => {
    try {
      let formData = new FormData();
      formData.append("user_id", userId);
      const response = await axios.post(
        process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/dashboard",
        formData
      );
      return response?.data;
    } catch (error) {
      console.log("Error fetching userSubscription API:", error);
      throw error;
    }
  }
);

const userSubscriptionSlice = createSlice({
  name: "userSubscription",
  initialState,
  reducers: {
    clearUserSubscription: (state) => {
      state.user_info = null;
      state.errors = "";
      state.sumo_data = null;
    },
    decrementQueryCount: (state, { payload }) => {
      const { modelName } = payload;
      if (state.user_info && state.user_info?.query_counts[modelName]) {
        state.user_info = {
          ...state.user_info,
          query_counts: {
            ...state.user_info.query_counts,
            [modelName]: {
              ...state.user_info?.query_counts[modelName],
              remaining:
                state.user_info?.query_counts[modelName]?.remaining - 1,
            },
          },
        };
      }
    },
    decrementBotQueryCount: (state, { payload }) => {
      const botValue = payload?.botValue;
      if (state.user_info && state.user_info?.free_limit) {
        state.user_info = {
          ...state.user_info,
          free_limit: {
            ...state.user_info.free_limit,
            [botValue]: {
              ...state.user_info?.free_limit[botValue],
              remaining: state.user_info?.free_limit[botValue]?.remaining - 1,
            },
          },
        };
      }
    },
    modifybotQueryCount: (state, { payload }) => {
      const botValue = payload?.botValue;
      const newQueryCount = payload?.newQueryCount;

      if (state.user_info && state.user_info?.free_limit[botValue]) {
        state.user_info = {
          ...state.user_info,
          free_limit: {
            ...state.user_info.free_limit,
            [botValue]: {
              ...state.user_info?.free_limit[botValue],
              remaining: newQueryCount,
            },
          },
        };
      }
    },
    updateRunCount: (state, { payload }) => {
      state.run_count = payload;
    },
    updateUserPreferenceTheme: (state, { payload }) => {
      state.preferences.theme = payload;
    },
    incrementTotalQueriesThisMonth: (state) => {
      if (
        state.sumo_data &&
        state.sumo_data.total_queries_this_month !== null
      ) {
        state.sumo_data = {
          ...state.sumo_data,
          total_queries_this_month:
            state.sumo_data.total_queries_this_month + 1,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserSubscription.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload?.status === "error") {
          state.errors = payload.status;
        } else {
          if (payload?.message?.is_appsumo_user) {
            state.sumo_data = payload?.message;
          } else {
            state.user_info = payload?.message;
            state.run_count = payload?.message?.run_count;
            state.preferences = payload?.message?.preferences;
          }
        }
      })
      .addCase(fetchUserSubscription.rejected, (state, action) => {
        state.loading = false;
        console.error("Error fetching userSubscription API:", action.error);
        state.errors = "Failed to fetch user subscription data.";
      });
  },
});

export const {
  clearUserSubscription,
  decrementQueryCount,
  decrementBotQueryCount,
  modifybotQueryCount,
  updateRunCount,
  updateUserPreferenceTheme,
  incrementTotalQueriesThisMonth,
} = userSubscriptionSlice.actions;

export default userSubscriptionSlice.reducer;
