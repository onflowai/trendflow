import React, { useEffect, useState, useCallback, useRef } from 'react';
import img from '../assets/images/test-img.jpg';
import Container from '../assets/wrappers/LandingPageContainer';
import customFetch from '../utils/customFetch';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import useWindowSize from '../hooks/useWindowSize';
import {
  LandingHero,
  LandingAbout,
  LandingFooter,
  LandingNavbar,
  FeaturedTrends,
  LandingServices,
  CustomErrorToast,
  PaginationComponent,
  FeaturedTrendsDesktop,
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
  const navigate = useNavigate();
  const {
    trends: initialTrendsData,
    hasNextPage,
    nextCursor,
  } = useLoaderData();

  const [trends, setTrends] = useState(initialTrendsData || []);
  const [pagination, setPagination] = useState({
    nextCursor: nextCursor || null,
    hasNextPage: hasNextPage || false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef();

  /**
   * Function to load more trends when the user scrolls to the bottom
   */
  const loadMoreTrends = async () => {
    if (!pagination.hasNextPage || isLoading) return;

    try {
      setIsLoading(true);
      const response = await customFetch.get('/trends/top-viewed', {
        params: {
          cursor: pagination.nextCursor,
          //limit: trendsPerPage,
        },
      });

      const {
        trends: newTrends,
        nextCursor: newNextCursor,
        hasNextPage: newHasNextPage,
      } = response.data;

      setTrends((prevTrends) => [...prevTrends, ...newTrends]);
      setPagination({
        nextCursor: newNextCursor,
        hasNextPage: newHasNextPage,
      });
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
      console.error('Error loading more trends:', error);
    } finally {
      setIsLoading(false);
    }
  }; //end loadMoreTrends

  /**
   * Intersection Observer callback to trigger loadMoreTrends
   */
  const lastTrendElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination.hasNextPage) {
          loadMoreTrends();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, pagination.hasNextPage]
  );

  return (
    <Container>
      <div className="container">
        <div>
          <LandingNavbar />
        </div>
        <LandingHero />
        <LandingServices />
        <LandingAbout />
        <div>
          <FeaturedTrendsDesktop featuredTrends={trends} />
          <PaginationComponent
            isLoading={isLoading}
            hasNextPage={pagination.hasNextPage}
          />
        </div>
      </div>
      <LandingFooter />
    </Container>
  );
};

export default Landing;
