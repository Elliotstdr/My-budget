import { store } from "../store";

export const UPDATE_DASHBOARD = "UPDATE_DASHBOARD";
export const updateDashboard = (value: Partial<DashboardState>) => {
  store.dispatch({
    type: UPDATE_DASHBOARD,
    value
  })
}