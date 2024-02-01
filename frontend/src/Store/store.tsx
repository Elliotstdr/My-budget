import { legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "./Reducers/authReducer";
import dashboardReducer from "./Reducers/dashboardReducer";
import statsReducer from "./Reducers/statsReducer";
import loanReducer from "./Reducers/loanReducer";
import salaryReducer from "./Reducers/salaryReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "dashboard", "stats", "loan", "salary"],
};

const rootReducer = combineReducers<RootState>({
  auth: authReducer,
  dashboard: dashboardReducer,
  stats: statsReducer,
  loan: loanReducer,
  salary: salaryReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, composeWithDevTools());
export const persistor = persistStore(store);
