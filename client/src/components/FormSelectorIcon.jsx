import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import Container from '../assets/wrappers/FormSelectorContainer';

const CustomOption = (props) => {
  const IconComponent = props.data.icon;
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
            <IconComponent />
          </span>
        )}
        {props.data.label}
      </div>
    </components.Option>
  );
};

const CustomSingleValue = (props) => {
  const IconComponent = props.data.icon;
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
            <IconComponent />
          </span>
        )}
        {props.data.label}
      </div>
    </components.SingleValue>
  );
};

const FormSelectorIcon = ({
  name,
  labelText,
  list,
  defaultValue,
  onChange,
  isClearable = true,
}) => {
  const initialOption =
    typeof defaultValue === 'string'
      ? list.find((option) => option.value === defaultValue)
      : defaultValue;

  const [selectedOption, setSelectedOption] = useState(initialOption);

  useEffect(() => {
    setSelectedOption(initialOption);
  }, [defaultValue]);

  const handleChange = (option) => {
    setSelectedOption(option);
    if (onChange) onChange(name, option);
  };

  return (
    <Container>
      <div className="form-row">
        <label htmlFor={name}>{labelText}</label>
        <Select
          id={name}
          name={name}
          value={selectedOption}
          onChange={handleChange}
          options={list}
          styles={customStyles}
          isClearable={isClearable}
          components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
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

export default FormSelectorIcon;
