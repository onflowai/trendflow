import React, { useState } from 'react';
import { FormSelector, SubmitButton } from '../components';
import Container from '../assets/wrappers/SearchTrendsContainer';
import { useCombinedContext } from '../context/CombinedContext.jsx';
import {
  TREND_CATEGORY,
  TECHNOLOGIES,
  STATUS,
  SORT_OPTIONS,
  TIME,
} from '../../../utils/constants';
import { Form, Link, useSubmit } from 'react-router-dom';

function SearchTrends() {
  const { searchValues } = useCombinedContext();
  const submit = useSubmit();

  // Local state to track dropdown values
  const [sortValues, setSortValues] = useState({
    topRated: searchValues.sort || SORT_OPTIONS.TOP_RATED_NOW,
    topViewed: searchValues.sort || SORT_OPTIONS.TOP_VIEWED_NOW,
    status: searchValues.chartType || 'all',
    updated: searchValues.sort || TIME.NEWEST,
  });

  const handleChange = (name, value) => {
    // Update the local state
    setSortValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    const form = document.getElementById('searchForm');
    const params = new URLSearchParams(new FormData(form));

    // Combine all sort-related values into a single sort parameter
    const combinedSort = `${sortValues.topRated}|${sortValues.topViewed}|${sortValues.status}|${sortValues.updated}`;
    params.set('sort', combinedSort);

    submit(form); // Submit the form after updating the parameter
  };

  return (
    <Container>
      <div className="submit-container">
        <div>
          <Form id="searchForm" className="form">
            <h4 className="form-title">Filter and Sort Trends:</h4>
            <div className="form-center">
              <FormSelector
                labelText="Choose Category:"
                name="trendCategory"
                defaultValue={searchValues.trendCategory || 'all'}
                list={['All', ...Object.values(TREND_CATEGORY)]}
                onChange={(value) => handleChange('trendCategory', value)}
              />
              <FormSelector
                labelText="Choose Technology:"
                name="trendTech"
                defaultValue={searchValues.trendTech || 'all'}
                list={['All', ...Object.values(TECHNOLOGIES)]}
                onChange={(value) => handleChange('trendTech', value)}
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
                onChange={(value) => handleChange('topRated', value)}
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
                onChange={(value) => handleChange('topViewed', value)}
              />
              <FormSelector
                labelText="Status:"
                name="status"
                defaultValue={sortValues.status}
                list={['All', ...Object.values(STATUS)]}
                onChange={(value) => handleChange('status', value)}
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
                onChange={(value) => handleChange('updated', value)}
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

export default SearchTrends;
