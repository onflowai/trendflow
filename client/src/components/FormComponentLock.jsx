import React from 'react';
import { IoLockClosed } from 'react-icons/io5';
import styled from 'styled-components';
/**
 * This component is responsible for all the inputs in the register form which is displayed in the Register.jsx
 * @param {*} param0
 * @returns
 */
const FormComponentLock = ({ type, name, labelText, defaultValue }) => {
  return (
    <Container>
      <div className="form-row">
        <label htmlFor={name} className="form-label">
          {labelText || name}
        </label>
        <div className="locked-input-container">
          <IoLockClosed className="lock-icon" />
          <input
            type={type}
            id={name}
            name={name}
            className="locked-input"
            value={defaultValue || ''}
            readOnly
          />
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`

.locked-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.lock-icon {
  position: absolute;
  left: 10px;
  color: var(--grey-400);
}

.locked-input {
  padding-left: 2rem; /* Adjust padding to make space for the icon */
  cursor: default; /* Use default cursor */
  background: var(--background-color);
  border: 1px solid var(--grey-50);
  color: var(--text-color);
  border-radius: var(--input-radius);
  width: 100%;
  height: 35px;
}

  .form-input {
    padding-left: 50px;
  
}
`;

export default FormComponentLock;
