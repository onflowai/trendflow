import React from 'react';
import {
  FormSelector,
  UserImgLarge,
  SubmitButton,
  FallbackChart,
  FormComponentLogos,
} from '../components';
import Container from '../assets/wrappers/SearchTrendsContainer';
import { TREND_CATEGORY, TECHNOLOGIES } from '../../../utils/constants';
import {
  Form,
  useNavigation,
  redirect,
  Link,
  useSubmit,
} from 'react-router-dom';
import { useAllTrendsContext } from '../pages/AllTrends';

function SearchTrends() {
  const { searchValues } = useAllTrendsContext();
  const submit = useSubmit();

  const handleChange = (name, value) => {
    const form = document.getElementById('searchForm');
    const params = new URLSearchParams(new FormData(form));
    params.set(name, value);
    console.log('VALUE: ', value);
    submit(form); // Submit the form after updating the parameter
  };

  return (
    <Container>
      <div className="submit-container">
        <div>
          <Form id="searchForm" className="form">
            <h4 className="form-title">Filter:</h4>
            <div className="form-center">
              <FormSelector
                labelText="Choose Category:"
                name="trendCategory"
                defaultValue={searchValues.trendCategory || 'all'}
                list={['All', ...Object.values(TREND_CATEGORY)]}
                onChange={handleChange}
              />
              <FormSelector
                labelText="Choose Technology:"
                name="trendTech"
                defaultValue={searchValues.trendTech || 'all'}
                list={['All', ...Object.values(TECHNOLOGIES)]}
                onChange={handleChange}
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
