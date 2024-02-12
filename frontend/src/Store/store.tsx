import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "./Reducers/authReducer";
import dashboardReducer from "./Reducers/dashboardReducer";
import statsReducer from "./Reducers/statsReducer";
import loanReducer from "./Reducers/loanReducer";
import salaryReducer from "./Reducers/salaryReducer";
import { configureStore } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers<RootState>({
  auth: authReducer,
  dashboard: dashboardReducer,
  stats: statsReducer,
  loan: loanReducer,
  salary: salaryReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});
export const persistor = persistStore(store);
