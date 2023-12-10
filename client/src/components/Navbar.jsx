import React, { useState, useEffect } from 'react';
import Container from '../assets/wrappers/Navbar';
import UserDropdown from './UserDropdown';
import DarkMode from './DarkMode';
import { IoIosArrowForward, IoIosArrowBack, IoIosMenu } from 'react-icons/io';
import { dashboardNavLinks } from '../assets/utils/data';
import { NavLink } from 'react-router-dom';
import { useDashboardContext } from '../pages/DashboardLayout';

function Navbar() {
  //toggle sidebar coming from DashboardLayout.jsx as context
  const { showSidebar, toggleSidebar } = useDashboardContext();
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
        <div className="navbar-link">
          {dashboardNavLinks.map((link) => {
            const { text, path } = link;
            return (
              <NavLink to={path} key={text} className="nav-links">
                {text}
              </NavLink>
            );
          })}
        </div>
        <DarkMode />
        <div className="btn-container">
          <UserDropdown />
        </div>
      </div>
    </Container>
  );
}

export default Navbar;
