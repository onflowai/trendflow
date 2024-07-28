import React, { useState } from 'react';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import styled from 'styled-components';

const SelectTrends = ({ selectedTrends, setSelectedTrends }) => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (searchTerm) => {
    try {
      const response = await customFetch.get(`/trends?search=${searchTerm}`);
      setSearchResults(response.data.trends);
    } catch (error) {
      console.error('Error searching trends:', error);
      toast.error('Error searching trends');
    }
  };

  const handleAddTrend = (trend) => {
    if (!selectedTrends.find((t) => t._id === trend._id)) {
      setSelectedTrends([...selectedTrends, trend]);
    }
  };

  const handleRemoveTrend = (trendId) => {
    setSelectedTrends(selectedTrends.filter((trend) => trend._id !== trendId));
  };

  return (
    <Container>
      <div className="search-container">
        <div className="search-component"></div>
      </div>
      <div>
        <ul>
          {searchResults.map((trend) => (
            <li key={trend._id}>
              {trend.trend}
              <button type="button" onClick={() => handleAddTrend(trend)}>
                +
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Selected Trends</h4>
        <ul>
          {selectedTrends.map((trend) => (
            <li key={trend._id}>
              {trend.trend}
              <button
                type="button"
                onClick={() => handleRemoveTrend(trend._id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

const Container = styled.div`
.search-container {
    display: flex;
    align-items: center;
    justify-content: flex-end; 
    margin-bottom: 1rem;
    width: 100%; /* Ensure it takes full width */

    span {
      margin-right: 0.5rem; /* Add some space between the text and the search component */
    }

    .search-component {
      display: flex;
      align-items: center;
    }
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }

  button {
    background: var(--primary-500);
    color: white;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: var(--border-radius);
    cursor: pointer;
  }

  button:hover {
    background: var(--primary-700);
  }
`;

export default SelectTrends;
