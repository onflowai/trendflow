import React from 'react';
import { useDashboardContext } from '../pages/DashboardLayout';
import { BsMoon, BsMoonFill, BsFillMoonStarsFill } from 'react-icons/bs';
import Container from '../assets/wrappers/DarkModeContainer';

const DarkMode = ({ size = 16 }) => {
  const { isDarkTheme, toggleDarkTheme } = useDashboardContext() || {};

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
