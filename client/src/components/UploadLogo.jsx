import React from 'react';
import styled, { keyframes } from 'styled-components';
import { BsCloudUploadFill } from 'react-icons/bs';

// Define the gradient animation
const gradientMove = keyframes`
  0% {
    background-position: 0% 100%; /* Start at bottom */
  }
  100% {
    background-position: 0% 0%; /* Move to top */
  }
`;

// Styled component for the upload icon
const StyledUploadIcon = styled(BsCloudUploadFill)`
  width: 50px; /* Adjust size as needed */
  height: 50px; /* Adjust size as needed */
  display: inline-block;
  
  /* Define the gradient background */
  background: linear-gradient(to top, white, red);
  
  /* Ensure the gradient covers the entire icon */
  background-size: 100% 200%;
  
  /* Apply background clip and text fill color for gradient effect */
  background-clip: text; /* Standard property */
  -webkit-background-clip: text; /* Webkit-specific property */
  
  color: transparent; /* Standard property */
  -webkit-text-fill-color: transparent; /* Webkit-specific property */
  
  /* Apply the gradient animation */
  animation: ${gradientMove} 2s linear infinite;
  
  /* Ensure the icon inherits the current color for proper masking */
  fill: currentColor;
  
  /* Fallback for browsers that do not support background-clip: text */
  @supports not ((-webkit-background-clip: text) and (-webkit-text-fill-color: transparent)) {
    color: red; /* Fallback color */
  }
`;

const UploadLogo = () => {
  return <StyledUploadIcon />;
};

export default UploadLogo;
