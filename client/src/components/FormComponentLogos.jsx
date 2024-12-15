import React from 'react';
import { LogoCarousel } from '../components';
import styled from 'styled-components';

const FormComponentLogos = ({ type, name, labelText, placeholder }) => {
  return (
    <Container>
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <div className="carousel-container">
        <LogoCarousel />
      </div>
      <input
        className="form-input"
        type={type}
        name={name} // Ensure this matches expected field names
        placeholder={placeholder}
      />
    </Container>
  );
};

const Container = styled.div`
  margin-top: -15px;
  position: relative;
  display: inline-block;
  width: 100%;

  input {
    width: 100%;
    padding-left: 40px; // Adjust padding to not overlap the carousel
    height: 40px; // Example height, adjust as needed
  }

  .carousel-container {
    position: absolute;
    left: 5px; // Position inside the input on the left
    top: 65%;
    transform: translateY(-50%);
    /* transform: translateX(-40%); */
    height: 23px;
    width: 23px;
    overflow: hidden;
  }
`;

export default FormComponentLogos;
