const INITIAL_STATE: DashboardState = {
  newExpense: 0,
  maxExpensePercentage: 0,
  data: null
};

export const UPDATE_DASHBOARD = "UPDATE_DASHBOARD";

const dashboardReducer = (state = INITIAL_STATE, action: any): DashboardState => {
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
