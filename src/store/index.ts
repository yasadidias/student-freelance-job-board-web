import { configureStore } from "@reduxjs/toolkit"
import applicationsReducer from "./applicationsSlice"
import authReducer from "./authSlice"
import jobsReducer from "./jobsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch