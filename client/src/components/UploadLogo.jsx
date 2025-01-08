import React from 'react';
import styled, { keyframes } from 'styled-components';
import { BsCloudUploadFill } from 'react-icons/bs';

const colorChange = keyframes`
  0% {
    color: var(--grey-100);
  }
  50% {
    color: var(--primary-400);
  }
  100% {
    color: var(--grey-100);
  }
`;

const AnimatedUploadIcon = styled(BsCloudUploadFill)`
  width: 50px;
  height: 50px;
  animation: ${colorChange} 4s infinite;
  transition: color 0.5s ease-in-out;
`;

const UploadLogo = () => {
  return <AnimatedUploadIcon />;
};

export default UploadLogo;
