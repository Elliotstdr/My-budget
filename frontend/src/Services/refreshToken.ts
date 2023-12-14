import { UPDATE_AUTH } from "../Store/Reducers/authReducer";
import { store } from "../Store/store";
import { fetchPost } from "./api";

// Une minute
export const timer = 60 * 1000;

const updateAuth = (value: Partial<AuthState>) => {
  return {
    type: UPDATE_AUTH,
    value
  }
}

/**
 * Vérifie l'état du token
 * @returns 
 */
export const checkToken = async () => {
  const auth = store.getState().auth
  // Si aucun token on déconnecte
  if (!auth.token) {
    logOut();
    return;
  }
  const decodedPayload = atob(auth.token.split(".")[1]);
  const payloadObject = JSON.parse(decodedPayload);
  if (payloadObject.exp * 1000 - new Date().getTime() < 0) {
    // Si le token expire on logout
    logOut();
  } else if (payloadObject.exp * 1000 - new Date().getTime() < 5 * timer) {
    // Si le token expire dans moins de 5 minutes on le refresh
    const newToken = await fetchPost("/auth/refresh", {})
    if (newToken.data) updateAuth({ token: newToken.data })
  }
};

/**
 * Vérifie l'activité de l'utilisateur
 */
export const checkActivity = () => {
  const auth = store.getState().auth
  const time = auth.newLogTime
  if (auth.isConnected) {
    // Si la dernière action de l'utilisateur était il y a plus d'une heure on logout
    if (time && new Date().getTime() - time > 60 * timer) logOut();
    // Sinon on met à jour l'heure de sa dernière action
    else store.dispatch(updateAuth({ newLogTime: new Date().getTime() }));
  }
  else if (time) {
    store.dispatch(updateAuth({ newLogTime: null }));
  }
};

/**
 * Fonction de logout
 */
export const logOut = () => {
  store.dispatch(updateAuth({
    isConnected: false,
    newLogTime: null,
    token: null,
    userConnected: null,
  }));
  window.location.href = "/";
};