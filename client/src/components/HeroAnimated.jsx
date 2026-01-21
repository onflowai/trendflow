import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import styled, { keyframes } from 'styled-components';
import LocalCleanedSVG from '../assets/images/logo-hero-03.svg?react';
import LocalCleanedSVGDark from '../assets/images/logo-hero-03-dark.svg?react';

const cdnCleanedSVG = 'https://cdn.trendflowai.com/content/logo-hero-03.svg';
const cdnCleanedSVGDark =
  'https://cdn.trendflowai.com/content/logo-hero-03-dark.svg';

const HeroAnimated = () => {
  const { isDarkTheme } = useTheme();
  const [hasError, setHasError] = useState(false);

  // Determine which CDN URL to use based on the theme
  const cdnSrc = isDarkTheme ? cdnCleanedSVGDark : cdnCleanedSVG;

  // Dedicated error handler function for the image
  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <Container>
      {/* Underlay Gradient */}
      <UnderlayGradient />
      {/* SVG Container */}
      <div className="svg-container">
        <StyledSVGWrapper>
          {hasError ? (
            isDarkTheme ? (
              <LocalCleanedSVGDark />
            ) : (
              <LocalCleanedSVG />
            )
          ) : (
            <img src={cdnSrc} alt="Logo Hero" onError={handleImageError} />
          )}
        </StyledSVGWrapper>
      </div>
      {/* Overlay Gradient */}
      <OverlayGradient />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 700.68px; /* Match SVG viewBox width */
  height: 432.56px; /* Match SVG viewBox height */
  display: flex; /* Add flexbox */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */

  .svg-container {
    width: 100%;
    height: 100%;
    position: center;
    z-index: 2;
  }
`;

const StyledSVGWrapper = styled.div`
  width: 80%; /* Adjust SVG size as needed */
  height: auto; /* Maintain aspect ratio */
`;

// Animation for gradient movement
const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const waveAnimation = keyframes`
  0% {
    stroke: #3498db;
    stroke-width: 2px;
    stroke-dasharray: 5, 15;
    stroke-dashoffset: 0;
  }
  50% {
    stroke: #e74c3c;
    stroke-width: 4px;
    stroke-dasharray: 15, 5;
    stroke-dashoffset: -10;
  }
  100% {
    stroke: #3498db;
    stroke-width: 2px;
    stroke-dasharray: 5, 15;
    stroke-dashoffset: 0;
  }
`;

const UnderlayGradient = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: radial-gradient(
//     135deg,
//     rgba(255, 126, 95, 0.01),
//     rgba(254, 180, 123, 0.08),
//     rgba(255, 126, 95, 0.2),
//     rgba(254, 180, 123, 0.1),
//     rgba(95, 159, 255, 0.1)
//   );
//   background-size: 100% 300%;
//   z-index: 1;
//   animation: ${gradientAnimation} 20s infinite ease-in-out;
`;

const OverlayGradient = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: radial-gradient(
//     circle,
//     rgba(106, 17, 203, 0.1),
//     rgba(37, 117, 252, 0.1),
//     rgba(106, 17, 203, 0.1),
//     rgba(37, 117, 252, 0.1),
//     rgba(106, 17, 203, 0.3)
//   );
//   background-size: 200% 200%;
//   z-index: 3;
//   animation: ${gradientAnimation} 15s infinite ease-in-out;
`;

export default HeroAnimated;
