import React from 'react';
import Container from '../assets/wrappers/SidebarContainer';
import { useDashboardContext } from '../pages/DashboardLayout';
import { SidebarSetting } from '../components';
import { dashboardLinks } from '../assets/utils/data';
import LogoBrand from './LogoBrand';
import NavLinks from './NavLinks';
/**
 * Sidebar is responsible for styling the opening and closing of the main dashboard sidebar
 * Passing isSidebar prop to which uses true or false state
 * @returns
 */
const Sidebar = () => {
  const { showSidebar } = useDashboardContext() || {};
  return (
    <Container>
      <div
        className={
          showSidebar ? 'sidebar-container show-sidebar' : 'sidebar-container'
        }
      >
        <div className="content">
          <header>
            <LogoBrand link="/dashboard" />
          </header>
          <div>
            <NavLinks isSidebar />
          </div>
          <div className="sidebar-settings-container">
            <SidebarSetting />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Sidebar;
