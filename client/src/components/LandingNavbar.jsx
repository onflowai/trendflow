import React, { useState, useEffect } from 'react';
import { socialLinks } from '../assets/utils/data';
import { Link } from 'react-router-dom';
import LandingNavbarLinks from './LandingNavbarLinks';
import LandingNavbarSocials from './LandingNavbarSocials';
import Container from '../assets/wrappers/LandingNavbarContainer';
import { IoIosMenu } from 'react-icons/io';
import Logo from './Logo';
import DarkMode from './DarkMode';
import LogoBrand from './LogoBrand';
import LandingOverlayMenu from './LandingOverlayMenu';

const LandingNavbar = () => {
  //using useState to set scroll initially to false
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
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

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  return (
    <Container hasScrolled={hasScrolled}>
      <nav className="navbar">
        <div className="nav-center">
          <div className="nav-header">
            <LogoBrand link="/" />
            <button
              type="button"
              className="nav-toggle"
              onClick={toggleOverlay}
              aria-label="Toggle menu"
            >
              <IoIosMenu />
            </button>
          </div>
          {/* <!-- left this comment on purpose --> */}
          <LandingNavbarLinks parentClass="nav-links" itemClass="nav-link" />
          <span className="vertical-line"></span>
          <div className="nav-links">
            <Link className="nav-link login-link" to="/login">
              login
            </Link>
          </div>
          <span className="vertical-line"></span>
          <ul className="nav-icons">
            {socialLinks.map((link) => {
              return (
                <LandingNavbarSocials
                  {...link}
                  key={link.id}
                  itemClass="nav-icon"
                />
              );
            })}
            <span className="vertical-line line-dark-mode"></span>
            <span className="dark-mode-div">
              <DarkMode className="dark-mode" />
            </span>
          </ul>
        </div>
      </nav>
      {isOverlayOpen && <LandingOverlayMenu toggleOverlay={toggleOverlay} />}
    </Container>
  );
};
export default LandingNavbar;
