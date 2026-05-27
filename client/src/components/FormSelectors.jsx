import React from 'react';
import Select from 'react-select';
import Container from '../assets/wrappers/FormSelectorContainer';

/**
 * simple multi selector with no icons
 * used for edit trend tech selection before approval
 */
const getCustomStyles = ({
  hight = '46px', //selector height
  borderColor = 'var(--grey-70)', //initial border color
  hoverBorderColor = 'var(--grey-100)', //hover border color
  focusBorderColor = 'var(--primary-200)', //focus border color
  focusBoxShadowColor = 'var(--primary-100)', //focus outline color
}) => ({
  control: (styles, state) => ({
    ...styles,
    minHeight: hight, //whole selector height
    borderRadius: 'var(--input-radius-rounded)',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: state.isFocused ? focusBorderColor : borderColor, //initial border color
    backgroundColor: 'var(--selector-main-color)',
    boxShadow: state.isFocused
      ? `0 0 0 1px ${focusBoxShadowColor}`
      : 'none',
    '&:hover': {
      borderColor: state.isFocused ? focusBorderColor : hoverBorderColor, //hover border color
    },
  }),

  valueContainer: (styles) => ({
    ...styles,
    padding: '4px 8px',
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
      ? 'var(--primary-200)'
      : isFocused
        ? 'var(--primary-50)'
        : null,
    color: 'var(--text-color)',
    cursor: 'pointer',
  }),

  multiValue: (styles) => ({
    ...styles,
    backgroundColor: 'var(--primary-200)', //keeps chips simple and readable
    borderRadius: '6px',
    minHeight: '30px',
    alignItems: 'center',
  }),

  multiValueLabel: (styles) => ({
    ...styles,
    color: 'var(--text-color)',
    padding: '4px 6px',
  }),

  multiValueRemove: (styles) => ({
    ...styles,
    width: '24px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'var(--red)',
      color: 'var(--white)',
    },
  }),

  clearIndicator: (styles) => ({
    ...styles,
    color: 'var(--text-color)',
  }),

  dropdownIndicator: (styles) => ({
    ...styles,
    color: 'var(--text-color)',
  }),

  indicatorSeparator: (styles) => ({
    ...styles,
    marginTop: '6px',
    marginBottom: '6px',
  }),
});

const FormSelectors = ({
  name,
  value = [],
  list = [],
  onChange,
  isClearable = false,
  maxSelections = 5,
  placeholder = 'Select...',
  hight = '46px',
  borderColor = 'var(--grey-70)',
  hoverBorderColor = 'var(--grey-100)',
  focusBorderColor = 'var(--primary-200)',
  focusBoxShadowColor = 'var(--primary-100)',
  labelText,
  labelFontSize = '0.8rem',
  labelColor = 'var(--grey-400)',
  labelFontWeight = '400',
  labelMarginBottom = '0.15rem',
}) => {
  const selectedValues = Array.isArray(value) ? value : []; //array of string values
  const selectedOptions = list.filter((option) =>
    selectedValues.includes(option.value)
  ); //convert string array into react-select options

  const handleChange = (selectedOptions) => {
    const next = Array.isArray(selectedOptions)
      ? selectedOptions.slice(0, maxSelections).map((option) => option.value)
      : []; //return only values to keep parent state simple

    if (onChange) onChange(name, next);
  };

  return (
    <Container>
      <div className="form-row">
        {labelText && (
          <label
            htmlFor={name}
            style={{
              fontSize: labelFontSize, //label styling
              color: labelColor,
              fontWeight: labelFontWeight,
              marginBottom: labelMarginBottom,
              display: 'block',
            }}
          >
            {labelText}
          </label>
        )}

        <Select
          id={name}
          name={name}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          value={selectedOptions}
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
          placeholder={placeholder}
          getOptionValue={(option) => option.value}
          isOptionDisabled={(option) => {
            const alreadySelected = selectedValues.includes(option.value);
            return selectedValues.length >= maxSelections && !alreadySelected;
          }}
        />
      </div>
    </Container>
  );
};

export default FormSelectors;