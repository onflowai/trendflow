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
import { Form, useNavigation, redirect, Link } from 'react-router-dom';
import { useAllTrendsContext } from '../pages/AllTrends';
/**
 * Search Trends is a component used in AllTrends to search for trends using query params
 * @returns
 */
function SearchTrends() {
  const { searchValues } = useAllTrendsContext();
  console.log(searchValues);
  // const navigation = useNavigation();
  // const isSubmitting = navigation.state === 'submitting';
  return (
    <Container>
      <div className="submit-container">
        <div>
          <Form method="post" className="form">
            <h4 className="form-title">Submit a Tech:</h4>
            <div className="form-center">
              {/* <FormComponent type="text" name="Any tech on your mind?" /> */}
              <FormSelector
                labelText="Choose Category:"
                name="trendCategory"
                defaultValue="all"
                list={['All', ...Object.values(TREND_CATEGORY)]}
                onChange={(e) => {
                  submit(e.currentTarget.form);
                }}
              />
              <FormSelector
                labelText="Choose Technology:"
                name="trendTech"
                defaultValue="all"
                list={['All', ...Object.values(TECHNOLOGIES)]}
                onChange={(e) => {
                  submit(e.currentTarget.form);
                }}
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
