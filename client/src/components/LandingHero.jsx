import React from 'react';
import { tagLarge, tagSmall } from '../assets/utils/data';
// import Container from '../assets/wrappers/LandingHeroContainer';
import HeroAnimated from './HeroAnimated';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
const LandingHero = ({ guestUser }) => {
  const handleStartUsing = async (e) => {
    e.preventDefault(); // Prevent default navigation
    await guestUser();
  };

  return (
    <section className="hero" id="home">
      <Container>
        <div className="container page">
          <div className="info">
            <h1>
              trend<span>Flow</span>
            </h1>
            <h2>{tagLarge}</h2>
            <p>{tagSmall}</p>
            <Link to="/register" className="btn register-link">
              Create Account
            </Link>
            <Link
              onClick={handleStartUsing}
              className="btn btn-color register-link"
            >
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

const Container = styled.section`
  nav {
    
  }
  .page {
    min-height: calc(45vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: 6rem;
  }
  h1 {
    font-weight: 700;
    span {
      color: var(--primary-700);
    }
    margin-bottom: 1.5rem;
  }
  h2 {
    font-weight: 700;
    font-size: 45px;
    span {
      color: var(--primary-700);
    }
    margin-bottom: 1.5rem;
  }
  p {
    line-height: 2;
    color: var(--text-second-color);
    margin-bottom: 1.5rem;
    max-width: 35em;
  }
  .register-link {
    margin-right: 1rem;
  }
  .main-img {
    display: none;
  }
  .btn {
    padding: 0.75rem 1rem;
  }
  @media (min-width: 992px) {
    .page {
    min-height: calc(50vh - var(--nav-height));
    }
    .page {
      grid-template-columns: 1fr 450px;
      column-gap: 1rem;
    }
    .main-img {
      display: block;
    }
  }
`;

export default LandingHero;
