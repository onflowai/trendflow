import React from 'react';
import error from '../assets/images/trendflow-error.svg';
/**
 * Custom Error Toast, styling is in index.css
 * @param {} param0
 * @returns
 */
const CustomErrorToast = ({ message }) => (
  <Container>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={error}
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

export default CustomErrorToast;
