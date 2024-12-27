import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Adjust the path if necessary
import { BsMoon, BsFillMoonStarsFill } from 'react-icons/bs';
import Container from '../assets/wrappers/DarkModeContainer';

const DarkMode = ({ size = 16 }) => {
  const { isDarkTheme, toggleDarkTheme } = useTheme(); // Use ThemeContext

  return (
    <Container onClick={toggleDarkTheme} className={isDarkTheme ? 'dark' : ''}>
      {isDarkTheme ? (
        <BsFillMoonStarsFill size={size} className="icon moon-icon" />
      ) : (
        <BsMoon size={size} className="icon moon-icon" />
      )}
    </Container>
  );
};

export default DarkMode;
