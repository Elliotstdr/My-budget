import { UPDATE_LOAN } from "../Actions/loanActions";

const initialState: LoanState = {
  capital: 100000,
  time: 15,
  interest: 5,
  monthCost: 0,
  fullCost: 0
};

const loanReducer = (state = initialState, action: any): LoanState => {
  switch (action.type) {
    case UPDATE_LOAN: {
      return {
        ...state,
        ...action.value,
      };
    }
    default:
      return state;
  }
};

export default loanReducer;
