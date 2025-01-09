import React, { useState } from 'react';
import styled from 'styled-components';
import { getFullIconUrl } from '../utils/urlHelper';

const FormComponentLogoBtn = ({
  type,
  name,
  labelText,
  defaultValue = '',
  buttonText,
  onClick,
  baseUrl,
  iconUrl,
}) => {
  const [inputValue, setInputValue] = useState(`${baseUrl}${defaultValue}`); //if defaultValue is empty, inputValue will just be github.com/

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    if (inputText.startsWith(baseUrl)) {
      setInputValue(inputText);
    } else {
      setInputValue(baseUrl);
    }
  }; //ensuring that the baseUrl part https://github.com/ remains intact at the beginning of the input field

  const handleFocus = (e) => {
    const inputElement = e.target;
    if (inputElement.value === baseUrl) {
      inputElement.setSelectionRange(baseUrl.length, baseUrl.length);
    }
  }; // user focuses on the input this function makes sure that the cursor is placed after the baseUrl portion

  const handleClickInput = (e) => {
    const inputElement = e.target;
    if (inputElement.selectionStart < baseUrl.length) {
      inputElement.setSelectionRange(baseUrl.length, baseUrl.length);
    }
  }; //ensuring that when the user clicks within the input field they can't place the cursor before the baseUrl

  //onclick username (part after baseUrl passed as an argument)
  return (
    <Container>
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <div className="input-wrapper">
        <img src={getFullIconUrl(iconUrl)} alt="icon" className="button-icon" />
        <input
          id={name}
          name={name}
          type={type}
          className="form-input-btn"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onClick={handleClickInput}
          required
        />
        <button
          type="button"
          className="action-button-logo"
          onClick={() => onClick(inputValue.replace(baseUrl, ''))}
        >
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
    width: 100%;
  }

  .button-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    z-index: 1;
  }

  .form-input-btn {
    flex: 1;
    padding-left: 30px; /* Add padding to make space for the icon */
    border-radius: var(--round-radius);
    background: var(--background-color);
    border: 1.5px solid var(--grey-50);
    color: var(--text-color);
    height: 35px;
    box-sizing: border-box;
    width: 100%;
  }

  .action-button-logo {
    position: absolute;
    right: 0.5em;
    top: 50%;
    transform: translateY(-50%);
    border-radius: var(--round-radius);
    background-color: var(--grey-70);
    border: 1px solid var(--grey-100);
    cursor: pointer;
    padding: 0 1em;
    color: white;
    height: calc(100% - 10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;

    &:hover {
      background-color: var(--grey-50);
    }

    &:active {
      background-color: var(--grey-100);
    }
  }
`;

export default FormComponentLogoBtn;
