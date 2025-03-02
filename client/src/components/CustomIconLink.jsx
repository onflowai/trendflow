import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import localIcon from '../assets/images/onflowai-link.svg';
const customLink = import.meta.env.VITE_DEV_PARENT_URL;

const CustomIconLink = ({ size = 17 }) => {
  const { isDarkTheme } = useTheme();
  const [hasError, setHasError] = useState(false);
  const cdnIcon = 'https://cdn.trendflowai.com/content/onflowai-link.svg';
  const imageSrc = hasError ? localIcon : cdnIcon;

  const handleImageError = (e) => {
    if (!hasError) {
      setHasError(true);
      e.target.src = localIcon;
    }
  };

  return (
    <Container
      className="custom-link"
      href={customLink}
      target="_blank"
      rel="noopener noreferrer"
      alt="onflow"
    >
      <img
        src={imageSrc}
        alt="OnFlowAi Icon"
        width={size}
        height={size}
        onError={handleImageError}
      />
    </Container>
  );
};

const Container = styled.a`
  opacity: 0.8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
  &:focus {
    outline: none;
  }
`;

export default CustomIconLink;
