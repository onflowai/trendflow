import React from 'react';
import img from '../assets/images/test-img.jpg';
import Container from '../assets/wrappers/LandingHero';
import { Link } from 'react-router-dom';
const LandingHero = () => {
  return (
    <section className="hero" id="home">
      <Container>
        <div className="container page">
          <div className="info">
            <h1>
              Trend<span>Flow</span>
            </h1>
            <h1>
              Find Out About New Tech Trends<span></span>
            </h1>
            <p>
              Track and find tech trends trends and learn how to make small
              projects to learn.
            </p>
            <Link to="/register" className="btn register-link">
              Create Account
            </Link>
            <Link to="/login" className="btn btn-color register-link">
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
