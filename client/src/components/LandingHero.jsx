import React from 'react';
import img from '../assets/images/test-img.jpg';
import { tagLarge, tagSmall } from '../assets/utils/data';
import Container from '../assets/wrappers/LandingHeroContainer';
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
          <img src={img} alt="" className="img main-img" />
        </div>
      </Container>
    </section>
  );
};
export default LandingHero;
