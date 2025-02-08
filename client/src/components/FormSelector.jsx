import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Container from '../assets/wrappers/FormSelectorContainer';
/**
 * Used in TrendEdit display trends and lets you change cat or tech before submitting
 * Does not display svg for admin simplicity
 * Component responsible for setting up selector programmatically
 * defaultValue = '' - defaultValue or a fallback of empty
 * Object.values = list
 * @param {*} param0
 * @returns
 */
//Custom option displays the icons and images for status and trendTech

const FormSelector = ({ name, value, list, onChange, isClearable = true }) => {
  const selectedOption = list.find((option) => option.value === value) || null; //converting parent's string into a react-select option
  const handleChange = (option) => {
    if (onChange) {
      onChange(name, option ? option.value : '');
    } //if user clears, option == null => send empty string
  }; //called when user picks a new option

  const iconUrl = selectedOption?.image || '';

  return (
    <Container>
      <div className="form-row">
        <Select
          name={name}
          value={selectedOption}
          onChange={handleChange}
          options={list}
          styles={customStyles}
          isClearable={isClearable}
        />
        <input
          type="hidden"
          name={name}
          value={selectedOption ? selectedOption.value : ''}
        />
        <input
          type="hidden"
          name={name === 'trendCategory' ? 'cateIconUrl' : 'techIconUrl'}
          value={iconUrl}
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
      ? 'var(--primary-200)'
      : isFocused
      ? 'var(--primary-50)'
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

export default FormSelector;
