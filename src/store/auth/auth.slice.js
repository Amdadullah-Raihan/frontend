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
      state.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));
    },
    removeUser: (state) => {
      state.user = {};
      state.token = '';
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { setUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
