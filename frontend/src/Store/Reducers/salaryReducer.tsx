import { createSlice } from "@reduxjs/toolkit";

const initialState: SalaryState = {
  salaireBrut: 2000,
  estCadre: false
};

export const salarySlice = createSlice({
  name: 'salary',
  initialState,
  reducers: {
    updateSalary: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    }
  }
})

export const { updateSalary } = salarySlice.actions

export default salarySlice.reducer;
