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
const FormSelector = ({
  name,
  labelText,
  list,
  defaultValue = '',
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState({
    value: defaultValue,
    label: defaultValue,
  });

  useEffect(() => {
    setSelectedOption({ value: defaultValue, label: defaultValue });
  }, [defaultValue]);

  const options = list.map((item) => ({ value: item, label: item }));

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    if (onChange) onChange(name, selectedOption.value); // Call the onChange prop function with the name and value
  };

  return (
    <Container>
      <div className="form-row">
        <label className="form-label" htmlFor={name}>
          {labelText || name}
        </label>
        <Select
          id={name}
          name={name}
          value={selectedOption}
          onChange={handleChange}
          options={options}
          classNamePrefix="form-select"
          styles={customStyles}
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
