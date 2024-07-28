import React from 'react';
import AsyncSelect from 'react-select/async';
import customFetch from '../utils/customFetch';
import styled from 'styled-components';
import { getFullTrendUrl } from '../utils/urlHelper';

const SelectTrends = ({
  selectedTrends,
  setSelectedTrends,
  labelText,
  placeholder,
}) => {
  const loadOptions = async (inputValue, callback) => {
    if (!inputValue.trim()) {
      callback([]);
      return;
    }

    try {
      const response = await customFetch.get(
        `/trends/search?search=${inputValue}`
      );
      const trendOptions = response.data.trends.map((trend) => ({
        value: trend._id,
        label: trend.trend,
        svg_url: trend.svg_url,
        slug: trend.slug,
      }));
      callback(trendOptions);
    } catch (error) {
      console.error('Error fetching trends:', error);
      callback([]);
    }
  };

  const handleChange = (selectedOptions) => {
    setSelectedTrends(selectedOptions || []);
  };
  const handleSelectedTrendClick = (event, slug) => {
    event.stopPropagation();
    const trendUrl = getFullTrendUrl(slug);
    window.open(trendUrl, '_blank');
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? 'var(--primary-200)' : 'var(--grey-50)',
      borderWidth: '1.5px',
      borderRadius: '8px',
      cursor: 'pointer',
      boxShadow: state.isFocused ? '0 0 0 1px blue' : null,
      '&:hover': {
        borderColor: state.isFocused ? 'var(--primary-600)' : 'var(--grey-100)',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'lightblue'
        : state.isFocused
        ? 'lightgray'
        : provided.backgroundColor,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'var(--primary-200)',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'var(--primary2-50)',
      borderRadius: '4px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'black',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'var(--red)',
        color: 'var(--white)',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // ensuring the menu is on top
    }),
  };

  const TrendOption = (props) => {
    const { innerRef, innerProps, data } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px',
          cursor: 'pointer',
        }}
      >
        <img
          src={data.svg_url}
          alt={data.label}
          style={{ width: '20px', height: '20px', marginRight: '10px' }}
        />
        <span>{data.label}</span>
      </div>
    );
  };
  const CustomMultiValueLabel = (props) => {
    const { data } = props;
    return (
      <div
        onClick={(event) => handleSelectedTrendClick(event, data.slug)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '7px',
          cursor: 'pointer',
        }}
      >
        {props.children}
      </div>
    );
  };
  console.log('selectedTrends', selectedTrends);
  return (
    <Container>
      {labelText && <div className="form-label">{labelText}</div>}
      <AsyncSelect
        className="basic-multi-select"
        isMulti
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        value={selectedTrends}
        onChange={handleChange}
        getOptionLabel={(e) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={e.svg_url}
              alt={e.label}
              style={{ width: '20px', height: '20px', marginRight: '10px' }}
            />
            {e.label}
          </div>
        )}
        getOptionValue={(e) => e.value}
        components={{
          Option: TrendOption,
          MultiValueLabel: CustomMultiValueLabel,
        }}
        styles={customStyles}
        placeholder={placeholder || 'Select...'}
      />
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  .css-1dyz3mf{
    padding: 2px 2px;
  }
  .form-label {
    margin-bottom: 0.1rem;
  }
`;

export default SelectTrends;
