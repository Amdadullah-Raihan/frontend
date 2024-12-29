import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './theme/theme.slice';
import authSlice from './auth/auth.slice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authSlice,
  },
});

export default store;
