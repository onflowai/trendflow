import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import Container from '../assets/wrappers/FormSelectorContainer';
import {
  getPublicFallbackByName,
  getBundledFallbackByName,
  getCategoryDisplayImage,
  handleIconError,
} from '../utils/iconFallbacks';
//import { getFullIconUrl } from '../utils/urlHelper';

// const getFallbackByName = (dropdownName) => {
//   if (dropdownName === 'trendCategory') return '/assets/cat/fallback-cat.svg';
//   if (dropdownName === 'trendTech') return '/assets/fallback-tech.svg';
//   return '/assets/fallback-tech.svg';
// };

const CustomOption = (props) => {
  const IconComponent = props.data.icon;
  const publicFallback = getPublicFallbackByName(props.selectProps?.name);
  const bundledFallback = getBundledFallbackByName(props.selectProps?.name);

  const imageSrc =
    props.selectProps?.name === 'trendCategory'
      ? getCategoryDisplayImage(props.data)
      : props.data.image || publicFallback;

  return (
    <components.Option {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {imageSrc ? (
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
        ) : (
          IconComponent && (
            <span style={{ marginRight: '10px' }}>
              <IconComponent />
            </span>
          )
        )}

        {props.data.label}
      </div>
    </components.Option>
  );
};

const CustomSingleValue = (props) => {
  const { isDarkTheme, name } = props.selectProps || {};// passing theme and dropdown name via selectProps
  const IconComponent = props.data.icon;
  const applyCustomStyling = name === 'trendCategory' && isDarkTheme === true;
  const publicFallback = getPublicFallbackByName(name);
  const bundledFallback = getBundledFallbackByName(name);

  const imageSrc =
    name === 'trendCategory'
      ? getCategoryDisplayImage(props.data)
      : props.data.image || publicFallback;

  return (
    <components.SingleValue {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {imageSrc ? (
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
              padding: applyCustomStyling ? '2px' : '0',
            }}
          >
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
        ) : (
          IconComponent && (
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
          )
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
  hight = '46px',
  borderColor = 'var(--grey-70)',
  hoverBorderColor = 'var(--grey-100)',
  focusBorderColor = 'var(--primary-200)',
  focusBoxShadowColor = 'var(--primary-100)',
  labelFontSize = '0.9rem',
  labelColor = 'var(--text-color)',
  labelFontWeight = '500',
  labelMarginBottom = '0.35rem',
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
        <label
          htmlFor={name}
          style={{
            fontSize: labelFontSize,
            color: labelColor,
            fontWeight: labelFontWeight,
            marginBottom: labelMarginBottom,
            display: 'block',
          }}
        >
          {labelText}
        </label>
        <Select
          id={name}
          name={name}
          value={selectedOption}
          onChange={handleChange}
          options={list}
          styles={getCustomStyles({
            hight,
            borderColor,
            hoverBorderColor,
            focusBorderColor,
            focusBoxShadowColor,
          })}
          isClearable={isClearable}
          components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
          isDarkTheme={isDarkTheme}
        />
      </div>
    </Container>
  );
};
const getCustomStyles = ({
  hight = '46px',
  borderColor = 'var(--grey-70)',
  hoverBorderColor = 'var(--grey-100)',
  focusBorderColor = 'var(--primary-200)',
  focusBoxShadowColor = 'var(--primary-100)',
}) => ({
  control: (styles, state) => ({
    ...styles,
    minHeight: hight,
    borderRadius: 'var(--input-radius-rounded)',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: state.isFocused ? focusBorderColor : borderColor,
    backgroundColor: 'var(--selector-main-color)',
    boxShadow: state.isFocused
      ? `0 0 0 1px ${focusBoxShadowColor}`
      : 'none',
    '&:hover': {
      borderColor: state.isFocused ? focusBorderColor : hoverBorderColor,
    },
  }),

  valueContainer: (styles) => ({
    ...styles,
    minHeight: hight,
    padding: '2px 8px',
    alignItems: 'center',
  }),
  menu: (styles) => ({
    ...styles,
    borderRadius: '10px',
    marginTop: '0px',
    overflow: 'hidden',
  }),
  menuList: (styles) => ({
    ...styles,
    paddingTop: '0px',
    paddingBottom: '0px',
    backgroundColor: 'var(--selector-dropdown-main-color)',
    borderRadius: 'inherit',
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

  placeholder: (styles) => ({
    ...styles,
    color: 'var(--text-color)',
  }),

  input: (styles) => ({
    ...styles,
    color: 'var(--text-color)',
    margin: '0',
    padding: '0',
  }),

  dropdownIndicator: (styles) => ({
    ...styles,
    color: 'var(--text-color)',
       width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    cursor: 'pointer',
  }),

  clearIndicator: (styles) => ({
    ...styles,
    color: 'var(--text-color)',
        width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    cursor: 'pointer',
  }),

  indicatorSeparator: (styles) => ({
    ...styles,
    marginTop: '6px',
    marginBottom: '6px',
  }),
});

export default FormSelectorIcon;

