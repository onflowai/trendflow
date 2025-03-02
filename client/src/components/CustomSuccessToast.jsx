import React, { useState } from 'react';
import localSuccess from '../assets/images/trendflow-success.svg';
import styled from 'styled-components';
/**
 * Custom Success Toast, styling is in index.css
 * @param {} param0
 * @returns
 */
const CustomSuccessToast = ({ message }) => {
  const cdnSuccess =
    'https://cdn.trendflowai.com/content/trendflow-success.svg';
  const [hasSuccess, setHasSuccess] = useState(false);
  const imageSrc = hasSuccess ? localSuccess : cdnSuccess;

  const handleImageSuccess = (e) => {
    if (!hasSuccess) {
      setHasSuccess(true);
      e.target.src = localSuccess;
    }
  };

  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={imageSrc}
          alt="Error"
          style={{ width: '20px', marginRight: '10px' }}
          onError={handleImageSuccess}
        />
        <span>{message}</span>
      </div>
    </Container>
  );
};

//styling is in the index.css
const Container = styled.div`
  
  
`;

export default CustomSuccessToast;
