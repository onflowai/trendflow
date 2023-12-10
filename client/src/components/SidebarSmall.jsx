import React from 'react';
import Container from '../assets/wrappers/SidebarSmall';
import { useDashboardContext } from '../pages/DashboardLayout';
import { IoIosClose } from 'react-icons/io';
import Logo from './Logo';
import NavLinks from './NavLinks';

/**
 * Will use conditional rendering to engage certain css classNames
 * @returns
 */
const SidebarSmall = () => {
  const data = useDashboardContext();
  console.log(data);

  const { showSidebar, toggleSidebar } = useDashboardContext();

  return (
    <Container>
      <div
        className={
          showSidebar ? 'sidebar-container show-sidebar' : 'sidebar-container'
        }
      >
        <div className="content">
          <button type="button" className="close-btn" onClick={toggleSidebar}>
            <IoIosClose />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </Container>
  );
};

export default SidebarSmall;
