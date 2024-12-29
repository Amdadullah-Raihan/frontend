import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: (() => {
    const savedTheme = localStorage.getItem('theme');
    return (
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('prefers-color-scheme: dark').matches)
    );
  })(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleNightMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      const newMode = state.isDarkMode ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      document.documentElement.classList.toggle('dark', state.isDarkMode);
    },
  },
});

export const { toggleNightMode } = themeSlice.actions;

export default themeSlice.reducer;
