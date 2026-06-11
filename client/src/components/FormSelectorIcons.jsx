import React from 'react';
import Select, { components } from 'react-select';
import Container from '../assets/wrappers/FormSelectorContainer';
import {
  TECH_FALLBACK_ICON,
  TECH_BUNDLED_FALLBACK_ICON,
  getTechDisplayImage,
  handleIconError,
} from '../utils/iconFallbacks';

//const TECH_FALLBACK_ICON = '/assets/fallback-tech.svg';

// const getTechDisplayImage = (option) => {
//   const image = String(option?.image || option?.fullImageUrl || '').trim();
//   if (image) return image;

//   const techIconUrl = String(option?.techIconUrl || '').trim();
//   if (techIconUrl) return techIconUrl.endsWith('.svg') ? techIconUrl : `${techIconUrl}.svg`;

//   const fileName = String(option?.fileName || '').trim();
//   if (fileName) return fileName.startsWith('/assets/') ? fileName : `/assets/${fileName}`;

//   return TECH_FALLBACK_ICON;
// };

const iconStyle = {
  width: '20px',
  height: '20px',
  minWidth: '20px',// keeps icon sizing consistent in options
  minHeight: '20px',// keeps icon sizing consistent in options
  marginRight: '10px',
  objectFit: 'contain',// prevents odd stretching
  display: 'block',
};

const smallIconStyle = {
  width: '16px',
  height: '16px',
  minWidth: '16px', //keeps selected pill icons centered
  minHeight: '16px', //keeps selected pill icons centered
  objectFit: 'contain',
  display: 'block',
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
};

const TechOption = (props) => {
  const imgSrc = getTechDisplayImage(props.data);

  return (
    <components.Option {...props}>
      <div style={rowStyle}>
        <img
          src={imgSrc}
          alt={props.data.label}
          style={iconStyle}
          onError={(event) =>
            handleIconError({
              event,
              publicFallback: TECH_FALLBACK_ICON,
              bundledFallback: TECH_BUNDLED_FALLBACK_ICON,
            })
          }
          draggable={false}
        />
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );
};

const TechMultiValueLabel = (props) => {
  const imgSrc = getTechDisplayImage(props.data);

  return (
    <components.MultiValueLabel {...props}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          minHeight: '24px', //makes pills vertically centered more cleanly
        }}
      >
        <img
          src={imgSrc}
          alt={props.data.label}
          style={smallIconStyle}
          onError={(event) =>
            handleIconError({
              event,
              publicFallback: TECH_FALLBACK_ICON,
              bundledFallback: TECH_BUNDLED_FALLBACK_ICON,
            })
          }
          draggable={false}
        />
        <span>{props.data.label}</span>
      </div>
    </components.MultiValueLabel>
  );
};

const FormSelectorIcons = ({
  hight = '46px',
  name,
  labelText,
  list = [],
  value = [],
  onChange,
  isClearable = false,
  maxSelections = 5,
  placeholder = 'Select technologies...',
  isDarkTheme,
  borderColor = 'var(--grey-70)',
  hoverBorderColor = 'var(--grey-100)',
  focusBorderColor = 'var(--primary-700)',
  focusBoxShadowColor = 'var(--primary-100)',
  labelFontSize = '0.8rem',
  labelColor = 'var(--grey-400)',
  labelFontWeight = '400',
  labelMarginBottom = '0.15rem',
}) => {
  const selectedValues = Array.isArray(value) ? value : [];

  const handleChange = (selectedOptions, meta) => { //meta gives action info
  const next = Array.isArray(selectedOptions)
    ? selectedOptions.slice(0, maxSelections)
    : [];

  if (onChange) onChange(name, next, meta); //pass meta up
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
        }}>{labelText}</label>
        <Select
          id={name}
          name={name}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          value={selectedValues}
          onChange={handleChange}
          options={list}
          styles={getCustomStyles({
            isDarkTheme,
            hight,
            borderColor,
            hoverBorderColor,
            focusBorderColor,
            focusBoxShadowColor,
          })}
          isClearable={isClearable}
          placeholder={placeholder}
          getOptionValue={(option) => option.value}
          isOptionDisabled={(option) => {
            const alreadySelected = selectedValues.some(
              (item) => item.value === option.value
            );

            return selectedValues.length >= maxSelections && !alreadySelected;
          }}
          components={{
            Option: TechOption,
            MultiValueLabel: TechMultiValueLabel,
          }}
          isDarkTheme={isDarkTheme}
        />
      </div>
    </Container>
  );
};

const getCustomStyles = ({ 
  isDarkTheme,
  hight = '46px',
  borderColor = 'var(--grey-100)',
  hoverBorderColor = 'var(--grey-100)',
  focusBorderColor = 'var(--primary-200)',
  focusBoxShadowColor = 'var(--primary-400)',
  }) => ({ 
  control: (styles, state) => {
  const activeBorderColor = state.isFocused
    ? focusBorderColor
    : borderColor || 'var(--grey-70)';

  return {
    ...styles,
    borderRadius: '8px',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: activeBorderColor,
    backgroundColor: 'var(--selector-main-color)',
    minHeight: hight,
    boxShadow: state.isFocused
      ? `0 0 0 1px ${focusBoxShadowColor}`
      : 'none',
    cursor: 'pointer',

    '&:hover': {
      borderColor: state.isFocused
        ? focusBorderColor
        : hoverBorderColor || activeBorderColor,
    },
  };
},

  valueContainer: (styles) => ({
    ...styles,
    padding: '4px 4px',
    gap: '4px',
    alignItems: 'center',
  }),

  input: (styles) => ({
    ...styles,
    margin: '0px',
    padding: '0px',
    color: 'var(--text-color)',
  }),

  placeholder: (styles) => ({
    ...styles,
    color: 'var(--text-color)',
  }),

  menu: (styles) => ({
    ...styles,
    borderRadius: '10px',
    marginTop: '0px',
    overflow: 'hidden',
    zIndex: 20,
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
    cursor: 'pointer',
    padding: '8px 12px',
  }),

  multiValue: (styles) => ({
    ...styles,
    backgroundColor: isDarkTheme
      ? 'var(--primary2-400)'
      : 'var(--primary2-50)',
    borderRadius: '6px',
    alignItems: 'center',
    minHeight: '34px',
    overflow: 'hidden',
  }),

  multiValueLabel: (styles) => ({
    ...styles,
    color: isDarkTheme ? 'var(--white)' : 'var(--text-color)',
    padding: '4px 6px',
    display: 'flex',
    alignItems: 'center',
  }),

  multiValueRemove: (styles) => ({
    ...styles,
    width: '24px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    cursor: 'pointer',
    borderRadius: '0',
    color: isDarkTheme ? 'var(--white)' : 'var(--text-color)',
    ':hover': {
      backgroundColor: 'var(--red)',
      color: 'var(--white)',
    },
  }),

  clearIndicator: (styles) => ({
    ...styles,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    cursor: 'pointer',
    color: 'var(--text-color)',
  }),

  dropdownIndicator: (styles) => ({
    ...styles,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    cursor: 'pointer',
    color: 'var(--text-color)',
  }),

  indicatorSeparator: (styles) => ({
    ...styles,
    marginTop: '6px',
    marginBottom: '6px',
  }),

  singleValue: (styles) => ({
    ...styles,
    color: 'var(--text-color)',
  }),
});

export default FormSelectorIcons;