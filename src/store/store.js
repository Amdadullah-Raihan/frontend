import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './theme/theme.slice';
import authSlice from './auth/auth.slice';
import { apiSlice } from './api/api.slice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
});

export default store;
