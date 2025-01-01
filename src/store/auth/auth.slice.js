import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || {},
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));
    },
    removeUser: (state) => {
      state.user = {};
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
