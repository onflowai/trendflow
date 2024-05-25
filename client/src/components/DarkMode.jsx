import React from 'react';
import { useDashboardContext } from '../pages/DashboardLayout';
import { PiMoonFill, PiMoonLight } from 'react-icons/pi';
import Container from '../assets/wrappers/DarkModeContainer';

const DarkMode = () => {
  const { isDarkTheme, toggleDarkTheme } = useDashboardContext() || {};

  return (
    <Container onClick={toggleDarkTheme} className={isDarkTheme ? 'dark' : ''}>
      {isDarkTheme ? (
        <PiMoonFill className="icon moon-icon" />
      ) : (
        <PiMoonLight className="icon moon-icon" />
      )}
    </Container>
  );
};

export default DarkMode;
