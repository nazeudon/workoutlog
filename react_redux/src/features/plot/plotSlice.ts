import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const initialState = {
  openPlot: false,
  plotType: true, // true -> total weight, false -> estimated max weight
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
    switchPlotType(state) {
      state.plotType = !state.plotType;
    },
    resetPlotType(state) {
      state.plotType = true;
    },
  },
});

export const {
  setOpenPlot,
  resetOpenPlot,
  switchPlotType,
  resetPlotType,
} = plotSlice.actions;

export const selectOpenPlot = (state: RootState) => state.plot.openPlot;
export const selectPlotType = (state: RootState) => state.plot.plotType;

export default plotSlice.reducer;
