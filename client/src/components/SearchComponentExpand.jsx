import React, { useState, useRef, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { LuSearch } from 'react-icons/lu';
import styled from 'styled-components';
/**
 *
 * @param {*} param0
 * @returns
 */
const SearchComponentExpand = ({
  type = 'text',
  name,
  onSearch,
  onClearSearch,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!inputValue) {
      setIsExpanded(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (onSearch) {
      onSearch(value); // Call onSearch as the user types
    }
  };

  const handleClear = () => {
    setInputValue('');
    inputRef.current.focus();
    if (onClearSearch) {
      onClearSearch();
    } // call the clear search function from parent
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  useEffect(() => {
    if (inputValue) {
      setIsExpanded(true);
    }
  }, [inputValue]);

  return (
    <Container>
      <div className={`input-container ${isExpanded ? 'expanded' : ''}`}>
        <LuSearch size={18} className="icon" onClick={handleFocus} />
        <input
          type={type}
          id={name}
          name={name}
          className="input"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={inputRef}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        {inputValue && (
          <IoCloseOutline className="icon clear-icon" onClick={handleClear} />
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  .input-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    width: 35px;
    transition: width 0.3s ease, transform 0.3s ease;

    &.expanded {
      width: 245px;
      transform: translateX(-205px); /* Move left by the difference between expanded and initial width */
    }
  }

  .icon {
    position: absolute;
    left: 15px;
    color: var(--grey-600);
    cursor: pointer;
  }

  .clear-icon {
    right: 10px;
    left: auto;
  }

  .input {
    padding-left: 2rem; /* Adjust padding to make space for the icon */
    padding-right: 2rem; /* Adjust padding to make space for the clear icon */
    cursor: pointer; /* Use default cursor */
    background: var(--background-color);
    border: 1px solid var(--grey-50);
    color: var(--text-color);
    border-radius: var(--input-radius-round);
    height: 35px;
    width: 100%;
    opacity: 0;
    transition: opacity 0.3s ease, width 0.3s ease;

    &.expanded {
      opacity: 1;
      cursor: text; /* Change cursor to text */
    }
  }

  .input-container.expanded .input {
    opacity: 1;
  }
`;

export default SearchComponentExpand;
