import React, { useState, useEffect } from 'react';
import { socialLinks } from '../assets/utils/data';
import { Link } from 'react-router-dom';
import LandingNavbarLinks from './LandingNavbarLinks';
import LandingNavbarSocials from './LandingNavbarSocials';
import Container from '../assets/wrappers/LandingNavbar';
import Logo from './Logo';
const LandingNavbar = () => {
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
      <nav className="navbar">
        <div className="nav-center">
          <div className="nav-header">
            <Logo />
            <button type="button" className="nav-toggle" id="nav-toggle">
              <i className="fas fa-bars"></i>
            </button>
          </div>
          {/* <!-- left this comment on purpose --> */}
          <LandingNavbarLinks parentClass="nav-links" itemClass="nav-link" />
          <span className="vertical-line"></span>
          <Link to="/login">login</Link>
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
          </ul>
        </div>
      </nav>
    </Container>
  );
};
export default LandingNavbar;
