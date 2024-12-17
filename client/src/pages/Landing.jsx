import React from 'react';
import img from '../assets/images/test-img.jpg';
import Container from '../assets/wrappers/LandingPageContainer';
import customFetch from '../utils/customFetch';
import { Link, useLoaderData } from 'react-router-dom';
import {
  LandingNavbar,
  LandingHero,
  LandingAbout,
  LandingServices,
  LandingFeatured,
  LandingFooter,
} from '../components';
/**
 *
 * @returns
 */

/**
 * Loader function to fetch top viewed trends for the Landing page
 * @returns {Object} data for top viewed trends
 */
export const loader = async () => {
  try {
    const response = await customFetch.get('/trends/top-viewed');
    const {
      trends,
      totalTrends,
      pagesNumber,
      currentPage,
      nextCursor,
      hasNextPage,
    } = response.data;
    return {
      trends,
      totalTrends,
      pagesNumber,
      currentPage,
      nextCursor,
      hasNextPage,
    };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    throw (
      error?.response?.data?.msg ||
      'An error occurred while fetching top viewed trends.'
    );
  }
};
const Landing = () => {
  const { trends } = useLoaderData();
  console.log('TRENDS: ', trends);
  return (
    <Container>
      <div className="container">
        <div>
          <LandingNavbar />
        </div>
        <LandingHero />
        <LandingServices />
        <LandingAbout />
        <LandingFeatured />
      </div>
      <LandingFooter />
    </Container>
  );
};

export default Landing;
