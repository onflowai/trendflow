import React from 'react';
import styled from 'styled-components';
/**
 * This component is responsible for all the inputs in the register form which is displayed in the Register.jsx
 * @param {*} param0
 * @returns
 */
const FormComponentButton = ({
  type,
  name,
  labelText,
  defaultValue,
  buttonText,
  onClick,
}) => {
  return (
    <Container>
      <div className="input-button-container">
        <label htmlFor={name} className="form-label">
          {labelText || name}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          className="form-input"
          defaultValue={defaultValue || ''}
          required
        />
        <button type="button" className="action-button" onClick={onClick}>
          {buttonText}
        </button>
      </div>
    </Container>
  );
};

const Container = styled.div`
.input-button-container {
    display: flex;
    flex-direction: column;
  }

  .form-label {
    margin-bottom: 0.5rem;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  .form-input {
    /* flex: 2; */
    height: 35px;
    padding-right: 4.5em; /* Adjust padding to prevent text overlap with button */
  }
  .action-button {
    position: absolute;
    right: 0.2em;
    top: 45%; /* Center vertically */
    transform: translateY(-45%);
    height: calc(90% - 9em); /* Adjust height to match input height */
    background-color: var(--grey-70);
    border: none;
    border-radius: var(--input-radius);
    border: 1px solid var(--grey-200);
    cursor: pointer;
    padding: 0 1em;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  &:hover {
      background-color: var(--grey-50); /* Color on hover */
    }
    &:active {
      background-color: var(--grey-100); /* Color on click */
    }
  }
`;

export default FormComponentButton;
