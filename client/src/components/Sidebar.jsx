import React from 'react';
import Container from '../assets/wrappers/Sidebar';
import { useDashboardContext } from '../pages/DashboardLayout';
import { dashboardLinks } from '../assets/utils/data';
import Logo from './Logo';
import NavLinks from './NavLinks';
/**
 * Sidebar is responsible for styling the opening and closing of the main dashboard sidebar
 * Passing isSidebar prop to which uses true or false state
 * @returns
 */
const Sidebar = () => {
  const { showSidebar } = useDashboardContext();
  return (
    <Container>
      <div
        className={
          showSidebar ? 'sidebar-container show-sidebar' : 'sidebar-container'
        }
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks isSidebar />
        </div>
      </div>
    </Container>
  );
};

export default Sidebar;
