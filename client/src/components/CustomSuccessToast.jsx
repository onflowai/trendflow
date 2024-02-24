import React from 'react';
import logo from '../assets/images/test-logo.svg';
import Container from '../assets/wrappers/CustomErrorToast';

const CustomSuccessToast = ({ message }) => (
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

export default CustomSuccessToast;
