import { createSlice } from "@reduxjs/toolkit";

const initialState: DashboardState = {
  newExpense: 0,
  maxExpensePercentage: 0,
  data: null
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateDashboard: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    }
  }
})

export const { updateDashboard } = dashboardSlice.actions

export default dashboardSlice.reducer;
