import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Container from '../assets/wrappers/FormSelectorContainer';
/**
 * Component responsible for setting up selector programmatically
 * defaultValue = '' - defaultValue or a fallback of empty
 * Object.values = list
 * @param {*} param0
 * @returns
 */
const FormSelector = ({ name, labelText, list, defaultValue, onChange }) => {
  // Convert defaultValue to object if it's a string
  const initialOption =
    typeof defaultValue === 'string'
      ? list.find((option) => option.value === defaultValue)
      : defaultValue;
  const [selectedOption, setSelectedOption] = useState(initialOption); // state to keep track of the selected option

  useEffect(() => {
    setSelectedOption(initialOption); // update selected
  }, [defaultValue]); // dependency array to re-run effect when defaultValue changes

  const handleChange = (option) => {
    setSelectedOption(option); // update local state with the selected option
    if (onChange) onChange(name, option.value); // Call the onChange prop with name and value
  }; // Function to handle changes in selection

  return (
    <Container>
      <div className="form-row">
        <label htmlFor={name}>{labelText}</label>
        <Select
          id={name}
          name={name}
          value={selectedOption} // Set the selected option value
          onChange={handleChange} // Handles change with the new selected option
          options={list} // Options need to be an array of { value, label } objects
          styles={customStyles}
          isClearable={true}
        />
      </div>
    </Container>
  );
};
const customStyles = {
  control: (styles) => ({
    ...styles,
    borderRadius: 'var(--input-radius)',
    border: '1px solid #ccc',
    // Ensure the control element's styling is consistent with the menu
  }),
  menu: (styles) => ({
    ...styles,
    borderRadius: '10px',
    marginTop: '0px', // Adjust the top margin to reduce or eliminate the gap
  }),
  menuList: (styles) => ({
    ...styles,
    paddingTop: '0px', // Reduce or eliminate padding at the top of the menu list
    paddingBottom: '0px', // Adjust bottom padding if needed
    // Further adjust spacing to ensure the dropdown fits snugly against the control
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? '#4caf50' : isFocused ? '#a5d6a7' : null,
    color: '#000',
    ':first-of-type': {
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
    },
    ':last-of-type': {
      borderBottomLeftRadius: '10px',
      borderBottomRightRadius: '10px',
    },
  }),
};

export default FormSelector;
