import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import customFetch from '../utils/customFetch';
import styled from 'styled-components';

const SelectTrends = ({ selectedTrends, setSelectedTrends }) => {
  const loadOptions = async (inputValue, callback) => {
    try {
      const response = await customFetch.get(
        `/trends/search?search=${inputValue}`
      );
      const trendOptions = response.data.trends.map((trend) => ({
        value: trend._id,
        label: trend.trend,
        svg_url: trend.svg_url,
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

  const TrendOption = (props) => {
    const { innerRef, innerProps, data } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{ display: 'flex', alignItems: 'center', padding: '8px' }}
      >
        <img
          src={data.svg_url}
          alt={data.trend}
          style={{ width: '20px', height: '20px', marginRight: '10px' }}
        />
        <span>{data.trend}</span>
      </div>
    );
  };

  return (
    <Container>
      <AsyncSelect
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
        components={{ Option: TrendOption }}
      />
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: 1rem;
`;

export default SelectTrends;
