// HeroAnimated.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import CleanedSVG from '../assets/images/logo-05-temp-trans.svg?react'; // Ensure correct suffix

const HeroAnimated = () => {
  return (
    <Container>
      {/* Underlay Gradient */}
      <UnderlayGradient />

      {/* SVG Container */}
      <div className="svg-container">
        <StyledSVGWrapper>
          <StyledSVG />
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
//     rgba(255, 126, 95, 0.01), /* Orange with 20% opacity */
//     rgba(254, 180, 123, 0.08), /* Light orange with 60% opacity */
//     rgba(255, 126, 95, 0.2), /* Orange with 40% opacity */
//     rgba(254, 180, 123, 0.1), /* Light orange with 80% opacity */
//     rgba(95, 159, 255, 0.1)  /* Orange with 30% opacity */
//   );
//   background-size: 100% 300% ;
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
//     rgba(106, 17, 203, 0.1), /* Purple with 50% opacity */
//     rgba(37, 117, 252, 0.1), /* Blue with 70% opacity */
//     rgba(106, 17, 203, 0.1), /* Purple with 40% opacity */
//     rgba(37, 117, 252, 0.1), /* Blue with 90% opacity */
//     rgba(106, 17, 203, 0.3)  /* Purple with 30% opacity */
//   );
//   background-size: 200% 200%; /* Allows smooth animation */
//   z-index: 3;
//   animation: ${gradientAnimation} 15s infinite ease-in-out; /* Different speed for variety */
`;

const StyledSVG = styled(CleanedSVG)`
   width: 100%; /* Scale to the wrapper's width */
  height: auto; /* Maintain the aspect ratio */

  .wave-path {
    /* animation: ${waveAnimation} 5s infinite linear; */
  }
`;

export default HeroAnimated;
