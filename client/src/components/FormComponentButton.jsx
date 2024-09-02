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
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <div className="input-wrapper">
        <input
          id={name}
          name={name}
          type={type}
          className="form-input-btn"
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
.form-label {
    margin-bottom: 0.5rem;
    display: block;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%; /* Ensure the input wrapper takes full width */
  }

  .form-input-btn {
    flex: 1;
    width: 100%; /* Ensure the input takes full width */
    border-radius: var(--round-radius);
    padding: 0.375rem 1em; /* Add padding to the right for the button */
    background: var(--background-color);
    border: 1.5px solid var(--grey-50);
    color: var(--text-color);
    height: 35px;
    box-sizing: border-box; /* Ensure padding is included in width calculation */
  }

  .action-button {
    position: absolute; /* Position the button inside the input */
    right: 0.5em; /* Adjust to position inside the input */
    top: 50%;
    transform: translateY(-50%);
    border-radius: var(--round-radius);
    background-color: var(--grey-70);
    border: 1px solid var(--grey-200);
    cursor: pointer;
    padding: 0 1em;
    color: white;
    height: calc(100% - 10px); /* Match input height, accounting for border */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1; /* Ensure button is above the input */

    &:hover {
      background-color: var(--grey-50);
    }

    &:active {
      background-color: var(--grey-100);
    }
  }
`;

export default FormComponentButton;
