// src/features/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const commonSlice = createSlice({
  name: "common",
  initialState: {
    sidebarCollapsed: false,
    threadBarOpen: false,
    popup: {
      visible: false,
      messageData: {
        title: "",
        description: "",
        btnArray: [],
      },
      classAdditions: {},
    },
    toaster: {
      visible: false,
      messageData: {
        variant: "",
        title: "",
        description: "",
        toasterCb: () => {},
      },
    },
  },
  reducers: {
    expandSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleThreadBar: (state) => {
      state.threadBarOpen = !state.threadBarOpen;
    },
    showPopup: (state, { payload }) => {
      state.popup.visible = true;
      state.popup.messageData = payload;
      state.popup.classAdditions = payload.classAdditions;
    },
    hidePopup: (state) => {
      state.popup.visible = false;
      state.messageData = {};
    },
    showToaster: (state, { payload }) => {
      state.toaster.visible = true;
      state.toaster.messageData = payload;
    },
    hideToaster: (state) => {
      state.toaster.visible = false;
      state.toaster = {};
    },
  },
});

export const {
  expandSidebar,
  showPopup,
  hidePopup,
  showToaster,
  hideToaster,
  toggleThreadBar,
} = commonSlice.actions;

export default commonSlice.reducer;
