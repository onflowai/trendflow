import React, { useState, useEffect } from 'react';
import { Checkbox, FormSelectorIcon, FormSelector } from '../components';
import Container from '../assets/wrappers/SearchTrendsContainer.js';
import { useCombinedContext } from '../context/CombinedContext.jsx';
import { FaInfinity } from 'react-icons/fa6';
import {
  AiFillCloseSquare,
  AiFillMinusCircle,
  AiFillDownCircle,
  AiFillUpCircle,
} from 'react-icons/ai';
import {
  TREND_CATEGORY,
  TECHNOLOGIES,
  STATUS,
  SORT_OPTIONS,
  TIME,
} from '../utils/constants.js';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Use useNavigate instead of useSubmit

function SearchTrendsLarge() {
  const { searchValues } = useCombinedContext(); // Context for search parameters
  const navigate = useNavigate(); // updating the URL without form submission
  const location = useLocation(); // getting the current URL parameters

  // State to track filter values
  const [filterValues, setFilterValues] = useState({
    trendCategory: searchValues.trendCategory || 'all',
    trendTech: searchValues.trendTech || 'all',
    status: searchValues.chartType || 'all',
    topRated: searchValues.topRated || '', // initializing as empty or from context
    topViewed: searchValues.topViewed || '', // initializing as empty or from context
    updated: searchValues.updated || TIME.NEWEST.value,
  });

  // Effect to update URL params whenever filterValues change
  useEffect(() => {
    updateQueryParams();
  }, [filterValues]); // dependency array ensures the effect runs on filterValues change

  // Function to handle changes in dropdown and checkbox values
  const handleChange = (name, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [name]: prev[name] === value ? '' : value, // Toggle or set the value
    }));
  };

  // Function to update query parameters and navigate
  const updateQueryParams = () => {
    const params = new URLSearchParams(location.search); // preserving other params in the URL

    // Add all filter values to params if they are not empty and not 'all'
    Object.keys(filterValues).forEach((key) => {
      if (filterValues[key] && filterValues[key] !== 'all') {
        params.set(key, filterValues[key]);
      } else {
        params.delete(key); // remove the param if it's empty or 'all'
      }
    });
    // navigate to the new URL with updated query params
    navigate(`?${params.toString()}`, { replace: true }); // updating the URL without reloading
  };
  const isChecked = (name, value) => filterValues[name] === value; // utility function to check if a checkbox is checked

  return (
    <Container>
      <div className="submit-container">
        <div className="filter-app">
          <div className="action-buttons">
            <div className="buttons">
              <AiFillDownCircle className="icon" />
              <AiFillMinusCircle className="icon" />
              <AiFillCloseSquare className="icon" />
            </div>
          </div>
          <div className="checkbox-group">
            <div className="checkbox">
              <h5>Top Rated:</h5>
              {[
                SORT_OPTIONS.TOP_RATED_NOW,
                SORT_OPTIONS.TOP_RATED_YEAR,
                SORT_OPTIONS.TOP_RATED_MONTH,
              ].map((option) => (
                <Checkbox
                  key={option.value}
                  checked={isChecked('topRated', option.value)}
                  onChange={() => handleChange('topRated', option.value)}
                  label={option.label}
                />
              ))}
            </div>
            <div className="checkbox">
              <h5>Top Viewed:</h5>
              {[
                SORT_OPTIONS.TOP_VIEWED_NOW,
                SORT_OPTIONS.TOP_VIEWED_YEAR,
                SORT_OPTIONS.TOP_VIEWED_MONTH,
              ].map((option) => (
                <Checkbox
                  key={option.value}
                  checked={isChecked('topViewed', option.value)}
                  onChange={() => handleChange('topViewed', option.value)}
                  label={option.label}
                />
              ))}
            </div>
          </div>
          <div className="select-group">
            <div className="select-group-one">
              <div className="select">
                <FormSelectorIcon
                  labelText="Choose Category:"
                  name="trendCategory"
                  defaultValue={filterValues.trendCategory}
                  list={[
                    { value: 'all', label: 'All', icon: FaInfinity },
                    ...Object.values(TREND_CATEGORY),
                  ]}
                  onChange={(name, value) =>
                    handleChange('trendCategory', value)
                  }
                />
              </div>
              <div className="select">
                <FormSelectorIcon
                  labelText="Choose Technology:"
                  name="trendTech"
                  defaultValue={filterValues.trendTech}
                  list={[
                    { value: 'all', label: 'All', icon: FaInfinity },
                    ...Object.values(TECHNOLOGIES),
                  ]}
                  onChange={(name, value) => handleChange('trendTech', value)}
                />
              </div>
            </div>
            <div className="select-group-two">
              <div className="select">
                <FormSelectorIcon
                  labelText="Status:"
                  name="status"
                  defaultValue={filterValues.status}
                  list={[
                    { value: 'all', label: 'All', icon: FaInfinity },
                    ...Object.values(STATUS),
                  ]}
                  onChange={(name, value) => handleChange('status', value)}
                />
              </div>
              <div className="select">
                <FormSelector
                  labelText="Updated:"
                  name="updated"
                  defaultValue={filterValues.updated}
                  list={[
                    TIME.NEWEST,
                    TIME.OLDEST,
                    TIME.NEWEST_MONTH,
                    TIME.NEWEST_YEAR,
                  ]}
                  onChange={(name, value) => handleChange('updated', value)}
                />
              </div>
            </div>
          </div>
          <Link to="/dashboard" className="btn btn-block form-btn">
            Reset Search
          </Link>
        </div>
      </div>
    </Container>
  );
}

export default SearchTrendsLarge;
