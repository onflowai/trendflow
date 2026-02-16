import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import Container from '../assets/wrappers/FormSelectorContainer';
//import { getFullIconUrl } from '../utils/urlHelper';

const getFallbackByName = (dropdownName) => {
  if (dropdownName === 'trendCategory') return '/assets/cat/fallback-cat.svg';
  if (dropdownName === 'trendTech') return '/assets/cat/fallback-tech.svg';
  return '/assets/cat/fallback-tech.svg';
};

const CustomOption = (props) => {
  const IconComponent = props.data.icon;
  const fallback = getFallbackByName(props.selectProps?.name);
  return (
    <components.Option {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {props.data.image && (
          <img
            //src={getFullIconUrl(props.data.image)}
            src={props.data.image}
            alt={props.data.label}
            style={{ width: '20px', marginRight: '10px' }}
            onError={(e) => { e.currentTarget.src = fallback; }}
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
  const applyCustomStyling = name === 'trendCategory' && isDarkTheme === true;//ISSUE HERE isDarkTheme cannot be passed
  const fallback = getFallbackByName(name);
  return (
    <components.SingleValue {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {props.data.image && (
          <div
            style={{
              backgroundColor: applyCustomStyling ? 'var(--off-white)' : 'transparent',
              borderRadius: applyCustomStyling ? '20%' : '0',
              width: applyCustomStyling ? '25px' : 'auto',
              height: applyCustomStyling ? '25px' : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '5px',
              padding: applyCustomStyling ? '1px' : '0',
            }}
          >
            <img
              src={props.data.image}
              alt={props.data.label}
              style={{ width: '20px', height: '20px' }}
              onError={(e) => { e.currentTarget.src = fallback; }}
              draggable={false}
            />
          </div>
        )}
        {IconComponent && (
          <div
            style={{
              backgroundColor: applyCustomStyling ? 'var(--off-white)' : 'transparent',
              borderRadius: applyCustomStyling ? '20%' : '0',
              width: applyCustomStyling ? '25px' : 'auto',
              height: applyCustomStyling ? '25px' : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '5px',
              padding: applyCustomStyling ? '1px' : '0',
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

