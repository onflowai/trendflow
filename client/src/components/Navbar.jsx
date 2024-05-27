import React, { useState, useEffect } from 'react';
import Container from '../assets/wrappers/NavbarContainer';
import UserDropdown from './UserDropdown';
import DarkMode from './DarkMode';
import FormComponentSearch from './FormComponentSearch';
import { IoIosArrowForward, IoIosArrowBack, IoIosMenu } from 'react-icons/io';
import { dashboardNavLinks } from '../assets/utils/data';
import { NavLink } from 'react-router-dom';
import { useDashboardContext } from '../pages/DashboardLayout';

function Navbar() {
  //toggle sidebar coming from DashboardLayout.jsx as context
  const { showSidebar, toggleSidebar } = useDashboardContext() || {};
  //using useState to set scroll initially to false
  const [hasScrolled, setHasScrolled] = useState(false);
  //Setting hasScrolled to true if scrolled down, false if scrolled to top
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };
    //Scroll event listener
    window.addEventListener('scroll', handleScroll);
    //Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Container hasScrolled={hasScrolled}>
      <div className="nav-center">
        <button
          type="button"
          className="toggle-btn arrow-btn"
          onClick={toggleSidebar}
        >
          {showSidebar ? <IoIosArrowBack /> : <IoIosArrowForward />}
        </button>
        <button
          type="button"
          className="toggle-btn menu-btn"
          onClick={toggleSidebar}
        >
          <IoIosMenu />
        </button>
        <div className="search-input">
          <FormComponentSearch />
        </div>
        <div className="btn-container">
          <DarkMode className="dark-mode" />
        </div>
        <div className="btn-container">
          <UserDropdown />
        </div>
      </div>
    </Container>
  );
}

export default Navbar;
