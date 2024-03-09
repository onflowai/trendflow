import React from 'react';
import { useDashboardContext } from '../pages/DashboardLayout';
import { HiOutlineSun, HiSun } from 'react-icons/hi';
import Container from '../assets/wrappers/DarkModeContiner';

const DarkMode = () => {
  const { isDarkTheme, toggleDarkTheme } = useDashboardContext() || {};

  return (
    <Container onClick={toggleDarkTheme} className={isDarkTheme ? 'dark' : ''}>
      <HiOutlineSun className="icon sun-icon" />
    </Container>
  );
};

export default DarkMode;
