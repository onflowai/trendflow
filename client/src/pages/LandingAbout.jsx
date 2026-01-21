import React, { useState } from 'react';
import {
  SEO,
  LandingNavbar,
  LandingFooter,
  LandingAboutCover,
} from '../components';
import styled from 'styled-components';
import { aboutDescription } from '../assets/utils/data.js';
import logoLight from '../assets/images/logo-sphere-color-light-01.svg';
import logoDark from '../assets/images/logo-sphere-color-dark-01.svg';
const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL;
import { useTheme } from '../context/ThemeContext';
//import LandingFeaturedCarousel from '../components/LandingFeaturedCarousel';
//import LandingCover from '../components/LandingCover';

const cdnLogoLight = 'https://cdn.trendflowai.com/content/logo-sphere-color-light-01.svg';
const cdnLogoDark  = 'https://cdn.trendflowai.com/content/logo-sphere-color-dark-01.svg';

const LandingAbout = () => {
  const { isDarkTheme } = useTheme();
  const [hasError, setHasError] = useState(false);
  const cdnSrc   = isDarkTheme ? cdnLogoDark : cdnLogoLight;     // same as HeroAnimated
  const localSrc = isDarkTheme ? logoDark     : logoLight;

  return (
    <Container>
      <SEO
        title="TrendFlow - About"
        description="TrendFlow helps you track the latest trends in tech."
        url={`${FRONTEND_BASE_URL}/about`}
        img_large={`${FRONTEND_BASE_URL}/og-image-about.jpg`}
        img_small={`${FRONTEND_BASE_URL}/og-image-about-twitter.jpg`}
      />
      <LandingNavbar />
      <div className="about-top">
        <div className="columns">
          <div className="left-column">
            <h1>trendflow</h1>
          </div>
          <div className="right-column">
            <p>{aboutDescription}</p>
          </div>
        </div>
        <div className="image-section">
          <LandingAboutCover />
          <img
            className="svg-overlay"
            src={hasError ? localSrc : cdnSrc}
            alt="Logo overlay"
            onError={() => setHasError(true)}     // identical fallback logic
            loading="lazy"
            draggable={false}
          />
          <div className="links">
            <span className="insta-label">stay updated:</span>
              <a
                className="insta-gradient-link"
                href=""
                target="_blank"
                rel="noopener noreferrer"
              >
                instagram/trendflow
              </a>
          </div>
        </div>
      </div>
      <LandingFooter />
    </Container>
  );
};

const Container = styled.main`
  display: flex;
  flex-direction: column;
  margin-top: 4rem;

  .about-top {
    display: flex;
    flex-direction: column;
  }

  .columns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
      padding: 1rem;
    }
  }

  .left-column {
    flex: 1;
    font-size: 3rem;
    font-weight: bold;
    text-align: center;
  }

  .right-column {
    flex: 1;
    font-size: 1.2rem;

    @media (min-width: 768px) {
      padding-left: 13rem;
    }

    @media (max-width: 768px) {
      margin-top: 1rem;
      font-size: 1rem;
    }
  }
  .right-column p {
    color: var(--grey-500);
  }

  .image-section {
    position: relative;
    width: 100%;
    height: 50vh; 
    margin-top: 4rem;

    @media (min-width: 1024px) {
      height: 30vh; 
    }
  }

  .background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 1rem;
  }

  .svg-overlay {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    width: 150px;

    @media (min-width: 768px) {
      width: 200px;
    }
    @media (min-width: 1024px) {
      width: 250px;
    }
  }

  .links {
  position: static;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;

  @media (max-width: 768px) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    background: rgba(0, 0, 0, 0.6);
    color: var(--white);
    border-radius: 0.9rem;
    width: 80%;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.insta-label {
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--black);
  letter-spacing: 1px;
}

.insta-gradient-link {
  font-size: 1.4rem;
  font-weight: bold;
  background: linear-gradient(
    90deg,
      var(--primary-200),
      var(--primary3-500),
      var(--primary2-400),
      var(--primary-300),
      var(--primary-100)
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: gradient-move 3s linear infinite;
  text-decoration: none;
  transition: opacity 0.2s;
  letter-spacing: 1px;
}

.insta-gradient-link:hover,
.insta-gradient-link:focus {
  opacity: 0.8;
}

@keyframes gradient-move {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
`;

export default LandingAbout;
