import authReducer from "./reducers/authReducer";
import botReducer from "./reducers/botReducer";
import commonReducer from "./reducers/commonReducer";
import { configureStore } from "@reduxjs/toolkit";
import userSubscriptionReducer from "./reducers/userSubscriptionReducer";
import themeReducer from "./reducers/themeReducer";
import codeEditorReducer from "./reducers/codeEditorReducer";
import apiKeyReducer from "./reducers/apiKeyReducer";
import sessionReducer from "./reducers/sessionReducer";
import dealsReducer from "./reducers/dealsReducer";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    auth: authReducer,
    bot: botReducer,
    userSubscription: userSubscriptionReducer,
    theme: themeReducer,
    code: codeEditorReducer,
    apiKeys: apiKeyReducer,
    sessions: sessionReducer,
    deals: dealsReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
