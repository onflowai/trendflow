import React, { useState } from 'react';
import localError from '../assets/images/trendflow-error.svg';
import styled from 'styled-components';

const CustomErrorToast = ({ message }) => {
  const cdnError = 'https://cdn.trendflowai.com/content/trendflow-error.svg';
  const [hasError, setHasError] = useState(false);
  const imageSrc = hasError ? localError : cdnError;

  const handleImageError = (e) => {
    if (!hasError) {
      setHasError(true);
      e.target.src = localError;
    }
  };

  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={imageSrc}
          alt="Error"
          style={{ width: '20px', marginRight: '10px' }}
          onError={handleImageError}
        />
        <span>{message}</span>
      </div>
    </Container>
  );
};

const Container = styled.div`
  /* Your existing styling, if any */
`;

export default CustomErrorToast;
