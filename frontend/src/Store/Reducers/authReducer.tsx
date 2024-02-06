import { UPDATE_AUTH, UPDATE_USER_CONNECTED } from "../Actions/authActions";

const initialState: AuthState = {
  isConnected: false,
  token: null,
  userConnected: null,
  newLogTime: null,
  toast: null
};

const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case UPDATE_AUTH: {
      return {
        ...state,
        ...action.value,
      };
    }
    case UPDATE_USER_CONNECTED: {
      return {
        ...state,
        userConnected: {
          ...state.userConnected,
          ...action.value
        }
      }
    }
    default:
      return state;
  }
};

export default authReducer;
