import React from 'react';
import success from '../assets/images/trendflow-success.svg';
/**
 * Custom Success Toast, styling is in index.css
 * @param {} param0
 * @returns
 */
const CustomSuccessToast = ({ message }) => (
  <Container>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={success}
        alt="Error"
        style={{ width: '20px', marginRight: '10px' }}
      />
      <span>{message}</span>
    </div>
  </Container>
);

import styled from 'styled-components';
//styling is in the index.css
const Container = styled.div`
  
  
`;

export default CustomSuccessToast;
