import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import Container from '../assets/wrappers/FormSelectorContainer';
import { FaInfinity } from 'react-icons/fa6';
import {
  getPublicFallbackByName,
  getBundledFallbackByName,
  getTechDisplayImage,
  getCategoryDisplayImage,
  handleIconError,
} from '../utils/iconFallbacks';

const getFilterDisplayImage = (option, dropdownName) => {
  // Do not show fallback icon for the "All" option.
  // It already uses FaInfinity.
  if (option?.value === 'all') return '';

  if (dropdownName === 'trendCategory') {
    return getCategoryDisplayImage(option);
  }

  if (dropdownName === 'trendTech') {
    return getTechDisplayImage(option);
  }

  return option?.image || '';
};

const iconBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '5px',
};

const CustomOption = (props) => {
  const { name } = props.selectProps || {};
  const IconComponent = props.data.icon;

  const publicFallback = getPublicFallbackByName(name);
  const bundledFallback = getBundledFallbackByName(name);
  const imageSrc = getFilterDisplayImage(props.data, name);

  return (
    <components.Option {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {imageSrc && (
          <img
            src={imageSrc}
            alt={props.data.label}
            style={{
              width: '20px',
              height: '20px',
              marginRight: '10px',
              objectFit: 'contain',
            }}
            onError={(event) =>
              handleIconError({
                event,
                publicFallback,
                bundledFallback,
              })
            }
            draggable={false}
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
  const publicFallback = getPublicFallbackByName(name);
  const bundledFallback = getBundledFallbackByName(name);
  const imageSrc = getFilterDisplayImage(props.data, name);

  // category SVGs often need a light background only in dark mode
  const applyCustomStyling = name === 'trendCategory' && isDarkTheme === true;

  const wrapperStyle = {
    ...iconBoxStyle,
    backgroundColor: applyCustomStyling ? 'var(--off-white)' : 'transparent',
    borderRadius: applyCustomStyling ? '20%' : '0',
    width: applyCustomStyling ? '25px' : 'auto',
    height: applyCustomStyling ? '25px' : 'auto',
    padding: applyCustomStyling ? '2px' : '0',
  };

  return (
    <components.SingleValue {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {imageSrc && (
          <div style={wrapperStyle}>
            <img
              src={imageSrc}
              alt={props.data.label}
              style={{
                width: '20px',
                height: '20px',
                objectFit: 'contain',
              }}
              onError={(event) =>
                handleIconError({
                  event,
                  publicFallback,
                  bundledFallback,
                })
              }
              draggable={false}
            />
          </div>
        )}
        {IconComponent && (
          <div style={wrapperStyle}>
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
  list = [],
  defaultValue,
  onChange,
  isClearable = true,
}) => {
  const [selectedOption, setSelectedOption] = useState(
    list.find((option) => option.value === defaultValue) || list[0] || null
  );

  useEffect(() => {
    const updatedOption =
      list.find((option) => option.value === defaultValue) || list[0] || null;
    setSelectedOption(updatedOption);
  }, [defaultValue, list]);

  const handleChange = (option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(name, option);
    }
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
          components={{
            Option: CustomOption,
            SingleValue: CustomSingleValue,
          }}
          isDarkTheme={isDarkTheme}
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
