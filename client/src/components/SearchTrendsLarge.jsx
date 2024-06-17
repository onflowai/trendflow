import React, { useState } from 'react';
import { FormSelector, SubmitButton, Checkbox } from './index.js';
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

  return (
    <Container>
      <div className="submit-container">
        <div>
          <Checkbox />
          <Form id="searchForm" className="form">
            <h4 className="form-title">Filter and Sort Trends:</h4>
            <div className="form-center">
              <FormSelector
                labelText="Choose Category:"
                name="trendCategory"
                defaultValue={searchValues.trendCategory || 'all'}
                list={[
                  { value: 'all', label: 'All' },
                  ...Object.values(TREND_CATEGORY),
                ]}
                onChange={(name, value) => handleChange('trendCategory', value)}
              />
              <FormSelector
                labelText="Choose Technology:"
                name="trendTech"
                defaultValue={searchValues.trendTech || 'all'}
                list={[
                  { value: 'all', label: 'All' },
                  ...Object.values(TECHNOLOGIES),
                ]}
                onChange={(name, value) => handleChange('trendTech', value)}
              />
              <FormSelector
                labelText="Status:"
                name="status"
                defaultValue={sortValues.status}
                list={[
                  { value: 'all', label: 'All' },
                  ...Object.values(STATUS),
                ]}
                onChange={(name, value) => handleChange('status', value)}
              />
              <FormSelector
                labelText="Top Rated:"
                name="topRated"
                defaultValue={sortValues.topRated}
                list={[
                  SORT_OPTIONS.TOP_RATED_NOW,
                  SORT_OPTIONS.TOP_RATED_YEAR,
                  SORT_OPTIONS.TOP_RATED_MONTH,
                ]}
                onChange={(name, value) => handleChange('topRated', value)}
              />
              <FormSelector
                labelText="Top Viewed:"
                name="topViewed"
                defaultValue={sortValues.topViewed}
                list={[
                  SORT_OPTIONS.TOP_VIEWED_NOW,
                  SORT_OPTIONS.TOP_VIEWED_YEAR,
                  SORT_OPTIONS.TOP_VIEWED_MONTH,
                ]}
                onChange={(name, value) => handleChange('topViewed', value)}
              />
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
