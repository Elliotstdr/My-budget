const INITIAL_STATE: StatsState = {
  date: null,
  detailSelectValue: 1,
  absolute: true,
  showAllLegends: false,
  legends: null
};

export const UPDATE_STATS = "UPDATE_STATS";

const statsReducer = (state = INITIAL_STATE, action: any): StatsState => {
  switch (action.type) {
    case UPDATE_STATS: {
      return {
        ...state,
        ...action.value,
      };
    }
    default:
      return state;
  }
};

export default statsReducer;
