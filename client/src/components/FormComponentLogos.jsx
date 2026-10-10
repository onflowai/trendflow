import React from 'react';
import { LogoCarousel } from '../components';
import { IoSettingsSharp } from 'react-icons/io5';
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
  showToolButton = false,
  toolButtonActive = false,
  toolButtonDisabled = false,
  onToolButtonClick,
  toolButtonLabel = 'Enable tool',
  toolButtonActiveLabel = 'Disable tool',
  toolIconLight,
  toolIconDark,
  toolIconHover,
  toolIconEnabled,
  isDarkTheme = false,
}) => {
  const defaultToolIcon = isDarkTheme ? toolIconDark : toolIconLight;

  return (
    <Container
      className={[
        className,
        showToolButton ? 'has-tool-button' : '',
        toolButtonActive ? 'tool-button-active' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>

      <div className="carousel-container" aria-hidden="true">
        <LogoCarousel />
      </div>

      <div className="input-tool-row">
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

        {showToolButton && (
          <button
            type="button"
            className="tool-button"
            onClick={onToolButtonClick}
            disabled={disabled || toolButtonDisabled}
            aria-pressed={toolButtonActive}
            aria-label={toolButtonActive ? toolButtonActiveLabel : toolButtonLabel}
            title={toolButtonActive ? toolButtonActiveLabel : toolButtonLabel}
          >
            {defaultToolIcon ? (
              <>
                <img
                  src={defaultToolIcon}
                  alt=""
                  className="tool-icon tool-icon-default"
                  draggable={false}
                />
                <img
                  src={toolIconHover || defaultToolIcon}
                  alt=""
                  className="tool-icon tool-icon-hover"
                  draggable={false}
                />
                <img
                  src={toolIconEnabled || defaultToolIcon}
                  alt=""
                  className="tool-icon tool-icon-enabled"
                  draggable={false}
                />
              </>
            ) : (
              <IoSettingsSharp className="tool-default-icon" />
            )}
          </button>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  margin-top: -15px;
  position: relative;
  display: inline-block;
  width: 100%;

  .input-tool-row {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }

  &.has-tool-button .input-tool-row {
    grid-template-columns: 1fr 40px;
  }

  input {
    width: 100%;
    padding-left: 40px; // Adjust padding to not overlap the carousel
    height: 40px; // Example height, adjust as needed
  }

  &.has-tool-button input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .tool-button {
    position: relative;
    width: 40px;
    height: 51px;
    border: 1.5px solid var(--grey-70);
    border-left: 0;
    border-radius: 0 var(--input-radius-rounded) var(--input-radius-rounded) 0;
    background: var(--white);
    color: var(--icon-btn-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
  }

  .tool-button:hover:not(:disabled) {
    border-color: var(--primary-200);
  }

  .tool-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .tool-icon {
    position: absolute;
    width: 24px;
    height: 24px;
    object-fit: contain;
    pointer-events: none;
  }

  .tool-icon-default {
    opacity: 1;
  }

  .tool-icon-hover,
  .tool-icon-enabled {
    opacity: 0;
  }

  &:not(.tool-button-active) .tool-button:hover:not(:disabled) .tool-icon-default {
    opacity: 0;
  }

  &:not(.tool-button-active) .tool-button:hover:not(:disabled) .tool-icon-hover {
    opacity: 1;
  }

  &.tool-button-active .tool-icon-default,
  &.tool-button-active .tool-icon-hover {
    opacity: 0;
  }

  &.tool-button-active .tool-icon-enabled {
    opacity: 1;
  }

  .tool-default-icon {
    width: 22px;
    height: 22px;
  }

  .carousel-container {
    position: absolute;
    left: 5px; // Position inside the input on the left
    top: 55%;
    transform: translateY(-1%);
    /* transform: translateX(-40%); */
    height: 100px;
    width: 23px;
    overflow: hidden;
    pointer-events: none;
  }
    @media (max-width: 768px) {
      margin-bottom: 1rem;
  }

`;

export default FormComponentLogos;