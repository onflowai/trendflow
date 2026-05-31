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
              trend<span>Flow</span><span className="inference-ai">ai</span>
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
  .inference-ai {
    --hero-ai-speed: 100s;
    --hero-ai-grain: 0.28;

    position: relative;
    color: transparent;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;

    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 90 90'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='90' height='90' filter='url(%23noise)' opacity='0.55'/%3E%3C/svg%3E"),
      linear-gradient(
        110deg,
        transparent 0%,
        var(--inference-color-1) 10%,
        var(--inference-color-2) 20%,
        transparent 30%,
        var(--inference-color-4) 42%,
        var(--inference-color-5) 54%,
        transparent 66%,
        var(--inference-color-8) 78%,
        var(--inference-color-9) 80%,
        transparent 100%
      ); //transparent stops make it appear/disappear

    background-size:
      90px 90px,
      260% 100%;

    background-position:
      0 0,
      0% 50%;

    background-blend-mode: soft-light, normal;
    animation: heroAiInferenceFlow var(--hero-ai-speed) linear infinite;
    }
  }

  @keyframes heroAiInferenceFlow {
    from {
      background-position:
        10 0,
        0% 50%;
    }

    to {
      background-position:
        0 10,
        260% 50%;
    }
  }

@media (min-width: 992px) {
  .page {
    min-height: calc(50vh - var(--nav-height));
    grid-template-columns: 1fr 450px;
    column-gap: 1rem;
  }

  .main-img {
    display: block;
  }
}

@media (max-width: 364px) {
  .btn-color {
    margin-top: 1rem;
  }
}
`;

export default LandingHero;
