import { UPDATE_DASHBOARD } from "../Actions/dashboardActions";

const initialState: DashboardState = {
  newExpense: 0,
  maxExpensePercentage: 0,
  data: null
};

const dashboardReducer = (state = initialState, action: any): DashboardState => {
  switch (action.type) {
    case UPDATE_DASHBOARD: {
      return {
        ...state,
        ...action.value,
      };
    }
    default:
      return state;
  }
};

export default dashboardReducer;
