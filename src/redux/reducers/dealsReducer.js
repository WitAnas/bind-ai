import { createSlice } from "@reduxjs/toolkit";

const dealSlice = createSlice({
  name: "deals",
  initialState: {
    showBanner: true,
  },
  reducers: {
    setShowBanner: (state, action) => {
      state.showBanner = action.payload;
    },
  },
});

export const { setShowBanner } = dealSlice.actions;
export default dealSlice.reducer;
