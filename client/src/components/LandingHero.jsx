import React from 'react';
import { tagLarge, tagSmall } from '../assets/utils/data';
import Container from '../assets/wrappers/LandingHeroContainer';
import HeroAnimated from './HeroAnimated';
import { Link } from 'react-router-dom';
const LandingHero = () => {
  return (
    <section className="hero" id="home">
      <Container>
        <div className="container page">
          <div className="info">
            <h1>
              trend<span>Flow</span>
            </h1>
            <h1>{tagLarge}</h1>
            <p>{tagSmall}</p>
            <Link to="/register" className="btn register-link">
              Create Account
            </Link>
            <Link to="/dashboard" className="btn btn-color register-link">
              Start Using
            </Link>
          </div>
          <div className="img main-img">
            <HeroAnimated />
          </div>
        </div>
      </Container>
    </section>
  );
};
export default LandingHero;
