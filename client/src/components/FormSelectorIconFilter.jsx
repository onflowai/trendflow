import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import Container from '../assets/wrappers/FormSelectorContainer';
import { FaInfinity } from 'react-icons/fa6';

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
  const { isDarkTheme, name } = props.selectProps || {}; // Pass theme and dropdown name via selectProps
  console.log('HERE in SINGLE VALUE: ', name, isDarkTheme);
  const IconComponent = props.data.icon;
  const applyCustomStyling = name === 'trendCategory'; //ISSUE HERE isDarkTheme cannot be passed
  return (
    <components.SingleValue {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {props.data.image && (
          <div
            style={{
              backgroundColor: applyCustomStyling
                ? 'var(--white-no-dark)'
                : 'transparent', // white background only when styling applies
              borderRadius: applyCustomStyling ? '20%' : '0', // rounded only in dark mode for trendCategory
              width: applyCustomStyling ? '25px' : 'auto', // box size for dark mode
              height: applyCustomStyling ? '25px' : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '5px', // space between box and label
            }}
          >
            <img
              src={props.data.image}
              alt={props.data.label}
              style={{
                width: '20px', // SVG size
                height: '20px',
              }}
            />
          </div>
        )}
        {IconComponent && (
          <div
            style={{
              backgroundColor: applyCustomStyling
                ? 'var(--white-no-dark)'
                : 'transparent',
              borderRadius: applyCustomStyling ? '20%' : '0',
              width: applyCustomStyling ? '25px' : 'auto',
              height: applyCustomStyling ? '25px' : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '5px',
            }}
          >
            <IconComponent style={{ width: '20px', height: '20px' }} />
          </div>
        )}
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );
};

const FormSelectorIconFilter = ({
  name,
  isDarkTheme,
  labelText,
  list,
  defaultValue,
  onChange,
  isClearable = true,
}) => {
  console.log('HERE: ', name, isDarkTheme);
  const [selectedOption, setSelectedOption] = useState(
    list.find((option) => option.value === defaultValue) || list[0]
  );

  useEffect(() => {
    const updatedOption =
      list.find((option) => option.value === defaultValue) || list[0];
    setSelectedOption(updatedOption); // Update state only when necessary
  }, [defaultValue, list]);

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
          selectProps={{ isDarkTheme, name }} // Pass additional props
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
    borderRadius: '10px',
    marginTop: '0px', // Adjust the top margin to reduce or eliminate the gap
    backgroundColor: 'var(--selector-dropdown-main-color)',
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
    color: isSelected
      ? 'var(--text-color)'
      : isFocused
      ? 'var(--text-color)'
      : 'var(--text-color)',
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

export default FormSelectorIconFilter;
