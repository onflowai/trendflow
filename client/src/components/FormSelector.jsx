import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Container from '../assets/wrappers/FormSelectorContainer';
/**
 * Used in TrendEdit display trends and lets you change cat or tech before submitting
 * Does not display svg for admin simplicity
 * Component responsible for setting up selector programmatically
 * defaultValue = '' - defaultValue or a fallback of empty
 * Object.values = list
 * @param {*} param0
 * @returns
 */
//Custom option displays the icons and images for status and trendTech

const FormSelector = ({
  name,
  labelText,
  list,
  defaultValue,
  onChange,
  isClearable = true,
}) => {
  // Convert defaultValue to object if it's a string
  const initialOption =
    typeof defaultValue === 'string'
      ? list.find((option) => option.label === defaultValue)
      : null;

  // State to keep track of the selected option
  const [selectedOption, setSelectedOption] = useState(initialOption);

  useEffect(() => {
    if (typeof defaultValue === 'string') {
      const matchingOption = list.find(
        (option) => option.label === defaultValue
      );
      setSelectedOption(matchingOption || null);
    }
  }, [defaultValue, list]); // If defaultValue changes, update selectedOption

  // Function to handle changes in selection
  const handleChange = (option) => {
    setSelectedOption(option); // Update local state with the selected option
    if (onChange) onChange(name, option ? option.value : ''); // Call the onChange prop with name and value or empty if cleared
  };

  return (
    <Container>
      {' '}
      {/* Styled container for the form group */}
      <div className="form-row">
        {' '}
        {/* Wrapper for the label and select elements */}
        <label htmlFor={name}>{labelText}</label>{' '}
        {/* Label for the select input */}
        <Select
          id={name} // Set the ID for the select input
          name={name} // Set the name attribute for the select input
          value={selectedOption || null} // Set the selected option value
          onChange={handleChange} // Handle changes in selection
          options={list} // Provide the list of options to the select input
          styles={customStyles} // Apply custom styles to the select component
          isClearable={isClearable} // Allow the option to clear the selection
        />
        <input
          type="hidden"
          name={name}
          value={selectedOption ? selectedOption.label : ''}
        />
      </div>
    </Container>
  );
};
const customStyles = {
  control: (styles) => ({
    ...styles,
    borderRadius: 'var(--input-radius-rounded)',
    border: '1.5px solid var(--grey-70)',
    backgroundColor: 'var(--selector-main-color)',
  }),
  menu: (styles) => ({
    ...styles,
    borderRadius: '10px', // Outer dropdown rounding
    marginTop: '0px', // Align dropdown with the selector
    overflow: 'hidden', // Prevent inner elements from breaking rounding
  }),
  menuList: (styles) => ({
    ...styles,
    paddingTop: '0px',
    paddingBottom: '0px',
    backgroundColor: 'var(--selector-dropdown-main-color)',
    borderRadius: 'inherit', // Inherit rounding from `menu`
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? 'var(--primary-200)'
      : isFocused
      ? 'var(--primary-50)'
      : null,
    color: 'var(--text-color)',
    ':first-of-type': {
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
    },
    ':last-of-type': {
      borderBottomLeftRadius: '10px',
      borderBottomRightRadius: '10px',
    },
  }),
  singleValue: (styles) => ({
    ...styles,
    color: 'var(--text-color)',
  }),
};

export default FormSelector;
