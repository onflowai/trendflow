import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import Container from '../assets/wrappers/FormSelectorContainer';
/**
 * Component responsible for setting up selector programmatically
 * defaultValue = '' - defaultValue or a fallback of empty
 * Object.values = list
 * @param {*} param0
 * @returns
 */

// CustomOption component for handling both images and icons
const CustomOption = (props) => {
  const IconComponent = props.data.icon; // Retrieve the component type
  return (
    <components.Option {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {props.data.image && (
          <img
            src={props.data.image}
            alt={props.data.label}
            style={{ width: '20px', marginRight: '10px' }}
          />
        )}
        {IconComponent && (
          <span style={{ marginRight: '10px' }}>
            <IconComponent /> {/* Render as component */}
          </span>
        )}
        {props.data.label}
      </div>
    </components.Option>
  );
};

// CustomSingleValue component to handle display of selected value with image or icon
const CustomSingleValue = (props) => {
  const IconComponent = props.data.icon; // Retrieve the component type
  return (
    <components.SingleValue {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {props.data.image && (
          <img
            src={props.data.image}
            alt={props.data.label}
            style={{ width: '20px', marginRight: '10px' }}
          />
        )}
        {IconComponent && (
          <span style={{ marginRight: '10px' }}>
            <IconComponent /> {/* Render as component */}
          </span>
        )}
        {props.data.label}
      </div>
    </components.SingleValue>
  );
};

const FormSelectorIconLocal = ({
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
      ? list.find((option) => option.value === defaultValue) // Find option matching the string defaultValue
      : defaultValue;

  // State to keep track of the selected option
  const [selectedOption, setSelectedOption] = useState(initialOption);

  useEffect(() => {
    setSelectedOption(initialOption); // Update selected option to match new defaultValue
  }, [defaultValue]); // Dependency array to re-run effect when defaultValue changes

  // Function to handle changes in selection
  const handleChange = (option) => {
    setSelectedOption(option); // Update local state with the selected option
    if (onChange) {
      // Ensure we're sending the correct value
      onChange(name, option ? option : { value: 'all', label: 'All' });
    }
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
          value={selectedOption} // Set the selected option value
          onChange={handleChange} // Handle changes in selection
          options={list} // Provide the list of options to the select input
          styles={customStyles} // Apply custom styles to the select component
          isClearable={isClearable} // Allow the option to clear the selection
          components={{ Option: CustomOption, SingleValue: CustomSingleValue }} // Include CustomSingleValue
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
    backgroundColor: isSelected
      ? 'var(--primary-200)'
      : isFocused
      ? 'var(--primary-50)'
      : null,
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

export default FormSelectorIconLocal;
