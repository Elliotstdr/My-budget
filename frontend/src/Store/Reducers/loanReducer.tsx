const INITIAL_STATE: LoanState = {
  capital: 100000,
  time: 15,
  interest: 5,
  monthCost: 0,
  fullCost: 0
};

export const UPDATE_LOAN = "UPDATE_LOAN";

const loanReducer = (state = INITIAL_STATE, action: any): LoanState => {
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
