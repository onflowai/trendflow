import React from 'react';
import logo from '../assets/images/error.svg';
import Container from '../assets/wrappers/CustomErrorToastContiner';
/**
 * Custom Error Toast, styling is in index.css
 * @param {} param0
 * @returns
 */
const CustomErrorToast = ({ message }) => (
  <Container>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={logo}
        alt="Error"
        style={{ width: '20px', marginRight: '10px' }}
      />
      <span>{message}</span>
    </div>
  </Container>
);

export default CustomErrorToast;
