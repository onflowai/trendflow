import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('darkTheme');
      return savedTheme === null ? false : savedTheme === 'true';
    }
    return false;
  }); // default to light theme unless a saved preference exists

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('dark-theme', isDarkTheme);
      localStorage.setItem('darkTheme', String(isDarkTheme));
    }
  }, [isDarkTheme]); // synchronize body class and localStorage

  const toggleDarkTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};