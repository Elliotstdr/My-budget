import { store } from "../store"

export const UPDATE_STATS = "UPDATE_STATS";
export const updateStats = (value: Partial<StatsState>) => {
  store.dispatch({
    type: UPDATE_STATS,
    value
  })
}