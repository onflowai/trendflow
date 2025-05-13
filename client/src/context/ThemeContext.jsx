import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  // Initialize theme based on localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('darkTheme') === 'true';
      setIsDarkTheme(savedTheme);
      document.body.classList.toggle('dark-theme', savedTheme);
    }
  }, []); // only run in the browser

  const toggleDarkTheme = () => {
    if (typeof window !== 'undefined') {
      setIsDarkTheme((prev) => {
        const newTheme = !prev;
        document.body.classList.toggle('dark-theme', newTheme);
        localStorage.setItem('darkTheme', newTheme);
        return newTheme;
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
