import React from 'react';
import { tagLarge, tagSmall } from '../assets/utils/data';
// import Container from '../assets/wrappers/LandingHeroContainer';
import HeroAnimated from './HeroAnimated';
import FeaturedDevs from './FeaturedDevs';
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
            <div className='featured-devs'>
            <FeaturedDevs
              owner="onflowai"
              repo="trendflow"
              limit={2}
              title="devs:"
              commits={false}
              notOnTheList="@github-actions[bot]"
              maxWidth="520px"
              imageMaxWidth={48}
            />
            </div>
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
    margin-bottom: 1.5rem;

    span {
      color: var(--primary-700);
    }
  }
  h1 > .inference-ai {
    --hero-ai-speed: 50s;
    --hero-ai-grain-size: 90px;

    text-transform: lowercase;
    position: relative;
    display: inline-block;
    color: transparent;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;

    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 90 90'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='90' height='90' filter='url(%23noise)' opacity='0.45'/%3E%3C/svg%3E"),
      linear-gradient(
        110deg,

        transparent 0%,

        transparent 6%,
        color-mix(in srgb, var(--inference-color-1) 35%, transparent) 10%,
        color-mix(in srgb, var(--inference-color-1) 70%, transparent) 14%,
        color-mix(in srgb, var(--inference-color-2) 70%, transparent) 20%,
        color-mix(in srgb, var(--inference-color-2) 35%, transparent) 24%,
        transparent 30%,

        transparent 36%,
        color-mix(in srgb, var(--inference-color-4) 40%, transparent) 42%,
        color-mix(in srgb, var(--inference-color-5) 75%, transparent) 54%,
        color-mix(in srgb, var(--inference-color-5) 35%, transparent) 60%,
        transparent 66%,

        transparent 72%,
        color-mix(in srgb, var(--inference-color-8) 40%, transparent) 78%,
        color-mix(in srgb, var(--inference-color-9) 75%, transparent) 86%,
        color-mix(in srgb, var(--inference-color-9) 35%, transparent) 92%,
        transparent 100%
      );

    background-size:
      var(--hero-ai-grain-size) var(--hero-ai-grain-size),
      260% 100%;

    background-position:
      0 0,
      0% 50%;

    background-blend-mode: soft-light, normal;
    animation: heroAiInferenceFlow var(--hero-ai-speed) linear infinite;
  }

  h2 {
    font-weight: 700;
    font-size: 45px;
    margin-bottom: 1.5rem;

    span {
      color: var(--primary-700);
    }
  }
  p {
    line-height: 2;
    color: var(--text-second-color);
    margin-bottom: 0.5rem;
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
  .featured-devs{
    margin-bottom: 0.5rem;
  }

  @keyframes heroAiInferenceFlow {
    from {
      background-position:
        0 0,
        0% 50%;
    }

    to {
      background-position:
        0 0,
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
