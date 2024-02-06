import { store } from "../store"

export const UPDATE_LOAN = "UPDATE_LOAN";
export const updateLoan = (value: Partial<LoanState>) => {
  store.dispatch({
    type: UPDATE_LOAN,
    value
  })
}