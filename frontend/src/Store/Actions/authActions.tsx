import { store } from "../store";

export const UPDATE_AUTH = "UPDATE_AUTH";
export const updateAuth = (value: Partial<AuthState>) => {
  store.dispatch({
    type: UPDATE_AUTH,
    value
  })
}

export const UPDATE_USER_CONNECTED = 'UPDATE_USER_CONNECTED';
export const updateUserConnected = (value: Partial<User>) => {
  store.dispatch({
    type: UPDATE_USER_CONNECTED,
    value
  })
}