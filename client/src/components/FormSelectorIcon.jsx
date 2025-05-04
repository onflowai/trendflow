import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import Container from '../assets/wrappers/FormSelectorContainer';
//import { getFullIconUrl } from '../utils/urlHelper';

const CustomOption = (props) => {
  const IconComponent = props.data.icon;
  return (
    <components.Option {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {props.data.image && (
          <img
            //src={getFullIconUrl(props.data.image)}
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
  const IconComponent = props.data.icon;
  const applyCustomStyling = name === 'trendCategory'; //ISSUE HERE isDarkTheme cannot be passed
  return (
    <components.SingleValue {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {props.data.image && (
          <div
            style={{
              backgroundColor: applyCustomStyling
                ? 'var(--off-white)'
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
              //src={getFullIconUrl(props.data.image)}
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
                ? 'var(--off-white)'
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

const FormSelectorIcon = ({
  name,
  isDarkTheme,
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
          selectProps={{ isDarkTheme, name }}
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
      ? 'var(--selector-dropdown-selected-color)'
      : isFocused
        ? 'var(--selector-dropdown-highlight-color)'
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

export default FormSelectorIcon;
