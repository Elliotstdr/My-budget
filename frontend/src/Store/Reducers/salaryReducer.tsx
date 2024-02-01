const INITIAL_STATE: SalaryState = {
  salaireBrut: 2000,
  estCadre: false
};

export const UPDATE_SALARY = "UPDATE_SALARY";

const salaryReducer = (state = INITIAL_STATE, action: any): SalaryState => {
  switch (action.type) {
    case UPDATE_SALARY: {
      return {
        ...state,
        ...action.value,
      };
    }
    default:
      return state;
  }
};

export default salaryReducer;
