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
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <div className="input-wrapper">
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

  .button-icon {
    width: 16px;
    height: 16px;
    margin-right: 0.5em;
    border-radius: 50%;
  }

  .form-input-btn {
    flex: 1;
    width: 100%; /* Ensure the input takes full width */
    border-radius: var(--round-radius);
    padding: 0rem 0.75rem;
    background: var(--background-color);
    border: 1.5px solid var(--grey-50);
    color: var(--text-color);
    height: 35px;
    padding-right: 0em;
  }

  .action-button-logo {
    border-radius: var(--round-radius);
    background-color: var(--grey-70);
    border: none;
    border: 1px solid var(--grey-200);
    cursor: pointer;
    padding: 0 1em;
    color: white;
    margin-left: -1.5em;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    &:hover {
      background-color: var(--grey-50);
    }

    &:active {
      background-color: var(--grey-100);
    }
  }
`;

export default FormComponentLogoBtn;
