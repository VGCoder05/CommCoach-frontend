import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import questionReducer from './slices/questionSlice';
import sessionReducer from './slices/sessionSlice';
import progressReducer from './slices/progressSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionReducer,
    session: sessionReducer,
    progress: progressReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For dates and other non-serializable data
    }),
});