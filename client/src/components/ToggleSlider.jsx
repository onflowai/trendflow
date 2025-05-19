import React from 'react';
import styled from 'styled-components';

const ToggleSlider = ({ options, value, onChange }) => {
  // Find the index and object for the current value
  const currentIdx = options.findIndex((opt) => opt.value === value);
  const currentOption = options[currentIdx] || {};

  const handleClick = (idx) => {
    if (onChange) onChange(options[idx].value);
  };
  console.log('value in ToggleSlider', value);
  return (
    <Container className="slider" data-count={options.length}>
      <div className="slider__row">
        {/* Conditionally render icon */}
        {currentOption.icon && (
          <img
            src={currentOption.icon}
            alt={`${currentOption.label} icon`}
            className="slider__icon"
            draggable={false}
          />
        )}
        <div className="slider-track">
          <div
            className="slider-thumb"
            style={{
              width: `${100 / options.length}%`,
              left: `${(100 / options.length) * currentIdx}%`,
            }}
          />
          {options.map((option, idx) => (
            <button
              key={option.value}
              className={`slider-option${idx === currentIdx ? ' slider-option--active' : ''}`}
              onClick={() => handleClick(idx)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0.5rem 0 1rem 0;
  padding: 0 5px;
  user-select: none;

  .slider__row {
    display: flex;
    align-items: center;
  }

  .slider__icon {
    width: 32px;
    height: 32px;
    margin-right: 16px;
    border-radius: 6px;
    background: var(--grey-50, #f7f7f7);
    object-fit: contain;
    box-shadow: 0 1px 6px rgba(60,80,150,0.09);
    transition: filter 0.25s;
    user-select: none;
    flex-shrink: 0;
  }

  .slider-track {
    flex: 1;
    position: relative;
    height: 40px;
    background: var(--grey-50);
    border-radius: var(--round-radius);
    border: 1.5px solid var(--grey-70);
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .slider-thumb {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 0;
    background: var(--primary-300, #6d8bfa);
    border-radius: 18px;
    z-index: 1;
    transition: left 0.3s cubic-bezier(.6,.4,0,1), background 0.25s;
    box-shadow: 0 2px 8px rgba(60,80,150,0.08);
    pointer-events: none;
  }

  .slider-option {
    flex: 1 1 0;
    position: relative;
    z-index: 2;
    height: 44px;
    background: transparent;
    border: none;
    outline: none;
    color: var(--grey-700, #555);
    font-weight: 500;
    font-size: 1rem;
    cursor: pointer;
    transition: color 0.25s, font-weight 0.25s;
    border-radius: 18px;
    padding: 0;
  }

  .slider-option--active {
    color: var(--white, #fff);
    font-weight: 700;
  }

  @media (max-width: 500px) {
    max-width: 98vw;
    .slider__icon {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
    .slider-track {
      height: 36px;
    }
    .slider-option {
      font-size: 0.9rem;
      height: 36px;
    }
    .slider-thumb {
      border-radius: 15px;
      top: 3px;
      bottom: 3px;
    }
  }
`;

export default ToggleSlider;
