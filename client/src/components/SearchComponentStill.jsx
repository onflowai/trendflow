import React from 'react';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';
import { LuSearch } from 'react-icons/lu';

const SearchComponentStill = ({
  type = 'text',
  name,
  value,
  onChange,
  labelText,
  onClear,
}) => {
  return (
    <Container>
      <div className="input-container">
        {labelText && <label htmlFor={name}>{labelText}</label>}
        <input
          type={type}
          id={name}
          name={name}
          className="input"
          value={value}
          onChange={onChange}
        />
        <LuSearch className="icon search-icon" />
        <IoClose
          size={20}
          className={`icon clear-icon ${!value ? 'disabled' : ''}`}
          onClick={value ? onClear : undefined}
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
  .input-container {
    position: relative;
    width: 100%;
  }

  .input {
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 2rem;
    border: 1.5px solid var(--grey-70);
    border-radius: var(--input-radius-rounded);
    background: var(--background-color);
    color: var(--text-color);
    height: 40px;
    transition: border-color 0.2s;
  }

  .input:hover,
  .input:focus {
    border-color: var(--grey-100); /* Highlight color on hover/focus */
  }

  .icon {
    position: absolute;
    top: 67%;
    transform: translateY(-50%);
    color: var(--grey-600);
    cursor: pointer;
  }

  .search-icon {
    left: 10px;
  }

  .clear-icon {
    right: 10px;
  }

  .clear-icon.disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export default SearchComponentStill;
