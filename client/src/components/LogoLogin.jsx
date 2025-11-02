import React, { useState } from 'react';
import localLogo from '../assets/images/logo-login.svg';
import styled from 'styled-components';

const LogoLogin = ({ size }) => {
  const [hasError, setHasError] = useState(false);
  const cdnLogo = 'https://cdn.trendflowai.com/content/logo-login.svg';
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
        className="logo-login"
        onError={handleImageError}
      />
    </Container>
  );
};

const Container = styled.section`
  .logo-login {
    width: ${({ size }) => size || '30px'};
  }
`;

export default LogoLogin;
