import React from 'react';
import styled from 'styled-components';
import { getFullIconUrl } from '../utils/urlHelper';

/**
 * This component is responsible for all the inputs in the register form which is displayed in the Register.jsx
 * @param {*} param0
 * @returns
 */
const FormComponentLogoBtn = ({
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
        <img
          src={getFullIconUrl('/assets/github-actions.svg')}
          alt="icon"
          className="button-icon"
        />
        <input
          id={name}
          name={name}
          type={type}
          className="form-input-btn"
          defaultValue={defaultValue || ''}
          required
        />
        <button type="button" className="action-button-logo" onClick={onClick}>
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

  .form-input-btn {
    border-radius: var(--round-radius);
    width: 100%;
    padding: 0.375rem 0.75rem;
    background: var(--background-color);
    border: 1.5px solid var(--grey-50); 
    color: var(--text-color);
    height: 35px;
    padding-right: 4.5em; 
  }

  .action-button-logo {
    border-radius: var(--round-radius);
    position: absolute;
    right: 0.4em;
    top: 45%; 
    transform: translateY(-45%);
    height: calc(90% - 9em); 
    background-color: var(--grey-70);
    border: none;
    border: 1px solid var(--grey-200);
    cursor: pointer;
    padding: 0 1em;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: var(--grey-50); 
    }

    &:active {
      background-color: var(--grey-100); 
    }
  }

  .button-icon {
    width: 16px; /* Adjust size as needed */
    height: 16px; 
    margin-right: 0.5em; /* Spacing between icon and text */
    border-radius: 50%; /* Makes the icon round */
  }
`;

export default FormComponentLogoBtn;
