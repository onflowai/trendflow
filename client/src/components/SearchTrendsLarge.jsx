import React, { useState } from 'react';
import { SubmitButton, Checkbox, FormSelectorIcon } from '../components';
import Container from '../assets/wrappers/SearchTrendsContainer.js';
import { useCombinedContext } from '../context/CombinedContext.jsx';
import {
  TREND_CATEGORY,
  TECHNOLOGIES,
  STATUS,
  SORT_OPTIONS,
  TIME,
} from '../utils/constants.js';
import { Form, Link, useSubmit } from 'react-router-dom';
import { FaInfinity } from 'react-icons/fa6';

function SearchTrendsLarge() {
  const { searchValues } = useCombinedContext(); // accessing context values related to search parameters
  const submit = useSubmit();

  // Local state to track dropdown values
  const [sortValues, setSortValues] = useState({
    topRated: searchValues.sort || SORT_OPTIONS.TOP_RATED_NOW.value, // Default to a sort option or fallback to TOP_RATED_NOW
    topViewed: searchValues.sort || SORT_OPTIONS.TOP_VIEWED_NOW.value,
    status: searchValues.chartType || 'all',
    updated: searchValues.sort || TIME.NEWEST.value,
  });
  // Function to handle changes in dropdown values
  const handleChange = (name, value) => {
    // Update the local state
    setSortValues((prev) => ({
      ...prev,
      [name]: value,
    })); // dynamically updating the specific sorting value
    const form = document.getElementById('searchForm'); // get the form element by ID
    const params = new URLSearchParams(new FormData(form)); // creating URL parameters from the form data
    // Combine all sort-related values into a single sort parameter
    const combinedSort = `${sortValues.topRated}|${sortValues.topViewed}|${sortValues.status}|${sortValues.updated}`;
    params.set('sort', combinedSort);
    submit(form); // Submit the form after updating the parameter
  }; //end handle change

  // Function to handle checkbox changes
  const handleCheckboxChange = (name, value) => {
    setSortValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    const form = document.getElementById('searchForm');
    const params = new URLSearchParams(new FormData(form));
    const combinedSort = `${sortValues.topRated}|${sortValues.topViewed}|${sortValues.status}|${sortValues.updated}`;
    params.set('sort', combinedSort);
    submit(form);
  };

  // Utility function to determine if a checkbox is checked
  const isChecked = (name, value) => sortValues[name] === value;

  return (
    <Container>
      <div className="submit-container">
        <div>
          <Checkbox />
          <Form id="searchForm" className="form">
            <h4 className="form-title">Filter and Sort Trends:</h4>
            <div className="form-center">
              <FormSelectorIcon
                labelText="Choose Category:"
                name="trendCategory"
                defaultValue={searchValues.trendCategory || 'all'}
                list={[
                  { value: 'all', label: 'All', icon: FaInfinity },
                  ...Object.values(TREND_CATEGORY),
                ]}
                onChange={(name, value) => handleChange('trendCategory', value)}
              />
              <FormSelectorIcon
                labelText="Choose Technology:"
                name="trendTech"
                defaultValue={searchValues.trendTech || 'all'}
                list={[
                  { value: 'all', label: 'All', icon: FaInfinity },
                  ...Object.values(TECHNOLOGIES),
                ]}
                onChange={(name, value) => handleChange('trendTech', value)}
              />
              <FormSelectorIcon
                labelText="Status:"
                name="status"
                defaultValue={sortValues.status}
                list={[
                  { value: 'all', label: 'All', icon: FaInfinity },
                  ...Object.values(STATUS),
                ]}
                onChange={(name, value) => handleChange('status', value)}
              />
              {/* Replace dropdown with checkboxes for Top Rated */}
              <div className="checkbox-group">
                <h5>Top Rated:</h5>
                {[
                  SORT_OPTIONS.TOP_RATED_NOW,
                  SORT_OPTIONS.TOP_RATED_YEAR,
                  SORT_OPTIONS.TOP_RATED_MONTH,
                ].map((option) => (
                  <Checkbox
                    key={option.value}
                    checked={isChecked('topRated', option.value)}
                    onChange={() =>
                      handleCheckboxChange('topRated', option.value)
                    }
                    label={option.label}
                  />
                ))}
              </div>

              {/* Replace dropdown with checkboxes for Top Viewed */}
              <div className="checkbox-group">
                <h5>Top Viewed:</h5>
                {[
                  SORT_OPTIONS.TOP_VIEWED_NOW,
                  SORT_OPTIONS.TOP_VIEWED_YEAR,
                  SORT_OPTIONS.TOP_VIEWED_MONTH,
                ].map((option) => (
                  <Checkbox
                    key={option.value}
                    checked={isChecked('topViewed', option.value)}
                    onChange={() =>
                      handleCheckboxChange('topViewed', option.value)
                    }
                    label={option.label}
                  />
                ))}
              </div>
              <FormSelector
                labelText="Updated:"
                name="updated"
                defaultValue={sortValues.updated}
                list={[
                  TIME.NEWEST,
                  TIME.OLDEST,
                  TIME.NEWEST_MONTH,
                  TIME.NEWEST_YEAR,
                ]}
                onChange={(name, value) => handleChange('updated', value)}
              />
              <Link to="/dashboard" className="btn btn-block form-btn">
                Reset Search
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
}

export default SearchTrendsLarge;
