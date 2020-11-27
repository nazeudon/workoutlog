import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const initialState = {
  openPlot: false,
};

export const plotSlice = createSlice({
  name: "plot",
  initialState: initialState,
  reducers: {
    setOpenPlot(state) {
      state.openPlot = true;
    },
    resetOpenPlot(state) {
      state.openPlot = false;
    },
  },
});

export const { setOpenPlot, resetOpenPlot } = plotSlice.actions;

export const selectOpenPlot = (state: RootState) => state.plot.openPlot;

export default plotSlice.reducer;
