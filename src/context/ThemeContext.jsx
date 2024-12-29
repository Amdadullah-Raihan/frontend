import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return (
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleNightMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = prevMode ? 'light' : 'dark';
      localStorage.setItem('theme', newMode);
      document.documentElement.classList.toggle('dark', newMode === 'dark');
      return !prevMode;
    });
  };

  const value = useMemo(() => ({ isDarkMode, toggleNightMode }), [isDarkMode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
