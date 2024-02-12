import { createSlice } from "@reduxjs/toolkit";

const initialState: LoanState = {
  capital: 100000,
  time: 15,
  interest: 5,
  monthCost: 0,
  fullCost: 0
};

export const loanSlice = createSlice({
  name: 'loan',
  initialState,
  reducers: {
    updateLoan: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    }
  }
})

export const { updateLoan } = loanSlice.actions

export default loanSlice.reducer;
