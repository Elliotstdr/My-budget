import { UPDATE_STATS } from "../Actions/statsActions";

const initialState: StatsState = {
  date: null,
  detailSelectValue: 1,
  absolute: true,
  showAllLegends: false,
  legends: null
};

const statsReducer = (state = initialState, action: any): StatsState => {
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
