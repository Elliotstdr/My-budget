import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
  isConnected: false,
  token: null,
  userConnected: null,
  newLogTime: null,
  toast: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAuth: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateUserConnected: (state, action) => {
      return {
        ...state,
        userConnected: {
          ...state.userConnected,
          ...action.payload
        }
      }
    }
  }
})

export const { updateAuth, updateUserConnected } = authSlice.actions

export default authSlice.reducer;
