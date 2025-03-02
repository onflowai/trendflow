import React, { useState } from 'react';
import localLogo from '../assets/images/logo-02.svg';
import styled from 'styled-components';

const Logo = ({ size }) => {
  const [hasError, setHasError] = useState(false);
  const cdnLogo = 'https://cdn.trendflowai.com/content/logo029.svg';
  const imageSrc = hasError ? localLogo : cdnLogo;

  const handleImageError = (e) => {
    if (!hasError) {
      setHasError(true);
      e.target.src = localLogo;
    }
  };

  return (
    <Container size={size}>
      <img
        src={imageSrc}
        alt="Tech Trend Flow Logo"
        className="logo"
        onError={handleImageError}
      />
    </Container>
  );
};

const Container = styled.section`
  .logo {
    width: ${({ size }) => size || '30px'};
  }
`;

export default Logo;
