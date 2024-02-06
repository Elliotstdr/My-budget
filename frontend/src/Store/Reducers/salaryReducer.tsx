import { UPDATE_SALARY } from "../Actions/salaryActions";

const initialState: SalaryState = {
  salaireBrut: 2000,
  estCadre: false
};

const salaryReducer = (state = initialState, action: any): SalaryState => {
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
