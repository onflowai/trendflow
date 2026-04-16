// File: client/src/components/LoadingBar.jsx
import React from 'react';
import styled, { keyframes, css } from 'styled-components';

/**
 * simple never ending loading bar
 */
const waveAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

const BarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 4px;
  background-color: var(--grey-70);
  overflow: hidden;
  border-radius: 999px; 
`;

const BarWave = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  height: 100%;
  background-color: var(--primary-500);
  animation: ${waveAnimation} 1.5s linear infinite;
  border-radius: 999px;
  filter: blur(0.9px);

  ${(p) =>
    p.$paused &&
    css`
      animation-play-state: paused;
    `}
`;

const LoadingBar = ({ paused = false }) => {
  return (
    <BarContainer>
      <BarWave $paused={paused} />
    </BarContainer>
  );
};

export default LoadingBar;