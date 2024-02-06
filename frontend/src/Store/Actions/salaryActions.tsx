import { store } from "../store"

export const UPDATE_SALARY = "UPDATE_SALARY";
export const updateSalary = (value: Partial<SalaryState>) => {
  store.dispatch({
    type: UPDATE_SALARY,
    value
  })
}