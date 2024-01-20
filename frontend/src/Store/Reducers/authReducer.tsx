const INITIAL_STATE: AuthState = {
  isConnected: false,
  token: null,
  userConnected: null,
  newLogTime: null,
  toast: null
};

export const UPDATE_AUTH = "UPDATE_AUTH";
export const UPDATE_USER_CONNECTED = 'UPDATE_USER_CONNECTED';

const authReducer = (state = INITIAL_STATE, action: any): AuthState => {
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
