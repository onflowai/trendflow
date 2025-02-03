import React from 'react';
import styled, { keyframes } from 'styled-components';

const waveAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
`;

const BarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 4px;
  background-color: var(--grey-70);
  overflow: hidden;
`;

const BarWave = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  height: 100%;
  background-color: var(--primary-500);
  animation: ${waveAnimation} 1.5s linear infinite;
`;

const LoadingBar = () => {
  return (
    <BarContainer>
      <BarWave />
    </BarContainer>
  );
};

export default LoadingBar;
