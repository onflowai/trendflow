import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Dropdown = ({ options, onOptionClick }) => {
  // const dropdownRef = useRef(null);
  // const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsDropdownVisible(false);
  //     }
  //   };
  // useEffect(() => {
  //     document.addEventListener('mousedown', handleClickOutside);
  //     return () => {
  //       document.removeEventListener('mousedown', handleClickOutside);
  //     };
  //   }, []);
  return (
    <Container>
      <div className="dropdown">
        {options.map((option, index) => (
          <div
            key={index}
            className="dropdown-option"
            onClick={() => onOptionClick(option.action)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </Container>
  );
};

const Container = styled.div`
  position: relative;

  .dropdown {
    position: absolute;
    top: 0px;
    right: -40px;
    background: white;
    border: 1px solid var(--grey-50);
    border-radius: var(--border-radius);
    padding: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;

    .dropdown-option {
      display: block;
      width: 100%;
      padding: 0.25rem 0.75rem;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-color);
      text-align: left;
      border-radius: var(--border-radius);

      &:hover {
        background: var(--grey-50);
      }

      &:active {
        background: var(--primary2-400);
      }
    }
  }
  /* &.settings-dropdown {
    .dropdown {
      top: auto;
      bottom: 0;
      transform: translateY(100%);
    }
  } */
  
`;

export default Dropdown;
