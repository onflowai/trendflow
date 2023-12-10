import React from 'react';
import img from '../assets/images/test-img.jpg';
import Container from '../assets/wrappers/LandingPage';
import { Link } from 'react-router-dom';
import {
  LandingNavbar,
  LandingHero,
  LandingAbout,
  LandingServices,
  LandingFeatured,
  Footer,
} from '../components';
/**
 *
 * @returns
 */
const Landing = () => {
  return (
    <Container>
      <div className="container">
        <div>
          <LandingNavbar />
        </div>
        <LandingHero />
        <LandingServices />
        <LandingAbout />
        <LandingFeatured />
      </div>
      <Footer />
    </Container>
  );
};

export default Landing;
