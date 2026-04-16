import React from 'react';
import { LogoCarousel } from '../components';
import styled from 'styled-components';

const FormComponentLogos = ({
  type,
  name,
  labelText,
  placeholder,
  value,
  onChange,
  onBlur,
  autoComplete,
  disabled,
  className,
}) => {
  return (
    <Container className={className}>
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>

      <div className="carousel-container" aria-hidden="true">
        <LogoCarousel />
      </div>

      <input
        id={name}
        className="form-input"
        type={type}
        name={name}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        disabled={disabled}
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
    pointer-events: none;
  }
    @media (max-width: 768px) {
      margin-bottom: 1rem;
  }

`;

export default FormComponentLogos;
