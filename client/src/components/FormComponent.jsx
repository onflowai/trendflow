import React from 'react';
import styled from 'styled-components';
/**
 * This component is responsible for all the inputs in the register form which is displayed in the Register.jsx
 * @param {*} param0
 * @returns
 */
const FormComponent = ({
  type,
  name,
  labelText,
  defaultValue,
  value,
  onChange,
}) => {
  return (
    <Container>
      <div className="form-row">
        <label htmlFor={name} className="form-label">
          {labelText || name}
        </label>
        <input
          type={type}
          id={name}
          name={name}
          className="form-input"
          placeholder={defaultValue || ''}
          value={value} // Controlled input
          onChange={onChange} // Handle changes
          required
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
  .form-input {
    @media (max-width: 768px) {
      font-size: 16px; /* Prevent zooming */
      transform: scale(0.9); /* Make it visually smaller */
    }
  }
`;

export default FormComponent;
