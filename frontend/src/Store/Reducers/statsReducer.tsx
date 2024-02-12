import { createSlice } from "@reduxjs/toolkit";

const initialState: StatsState = {
  date: null,
  detailSelectValue: 1,
  absolute: true,
  showAllLegends: false,
  legends: null
};

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    updateStats: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    }
  }
})

export const { updateStats } = statsSlice.actions

export default statsSlice.reducer;
