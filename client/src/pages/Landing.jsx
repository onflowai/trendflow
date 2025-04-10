import React, { useEffect, useState, useCallback, useRef } from 'react';
import Container from '../assets/wrappers/LandingPageContainer';
import customFetch from '../utils/customFetch';
import {
  Link,
  useLoaderData,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import useWindowSize from '../hooks/useWindowSize';
import { toast } from 'react-toastify';
import {
  SEO,
  LandingHero,
  LandingAbout,
  LandingFooter,
  LandingNavbar,
  StructuredData,
  LandingServices,
  CustomErrorToast,
  CustomSuccessToast,
  PaginationFeatured,
  FeaturedTrendsMobile,
  FeaturedTrendsDesktop,
} from '../components';
const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL;
/**
 * Landing displays the featured trends
 * @returns
 */

const getCsrfToken = async () => {
  try {
    const response = await customFetch.get('/csrf-token');
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};
/**
 * Loader function to fetch top viewed trends for the Landing page
 * @returns {Object} data for top viewed trends
 */
export const loader = async () => {
  try {
    const response = await customFetch.get('/trends/top-viewed');
    const { trends, totalTrends, nextCursor, hasNextPage } = response.data;
    return {
      trends: Array.isArray(trends) ? trends : [],
      totalTrends: totalTrends || 0,
      nextCursor: nextCursor || null,
      hasNextPage: !!hasNextPage,
    };
  } catch (error) {
    if (typeof window !== 'undefined') {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    } else {
      console.error(
        'SSR Loader Error:',
        error?.response?.data?.msg || error.message
      );
    }
    const fallbackData = {
      trends: [],
      totalTrends: 0,
      nextCursor: null,
      hasNextPage: false,
      error:
        error?.response?.data?.msg ||
        'An error occurred while fetching top viewed trends.',
    };
    if (typeof window !== 'undefined') {
      throw fallbackData.error;
    }
    return fallbackData;
  }
};

const scrollToHash = (hash) => {
  const element = document.getElementById(hash);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const useScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.substring(1); // remove the '#'
      const interval = setInterval(() => {
        const element = document.getElementById(hash);
        if (element) {
          scrollToHash(hash);
          clearInterval(interval);
        }
      }, 100);

      // stop polling after 3s just in case
      setTimeout(() => clearInterval(interval), 3000);
    }
  }, [location]);
};

const Landing = () => {
  useScrollToHash();
  const navigate = useNavigate();
  const data = useLoaderData() || {};
  const {
    trends: initialTrendsData = [],
    hasNextPage: initialHasNextPage = false,
    nextCursor: initialNextCursor = null,
    error,
  } = data;

  useEffect(() => {
    if (error) {
      toast.error(<CustomErrorToast message={error} />);
    }
  }, [error]);

  const [trends, setTrends] = useState(initialTrendsData || []);
  const [pagination, setPagination] = useState({
    nextCursor: initialNextCursor || null,
    hasNextPage: initialHasNextPage || false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef();
  const isMobile = typeof window !== 'undefined' ? useWindowSize() : false;

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

  /**
   * Function to load more trends when the user scrolls to the bottom
   */
  const loadMoreTrends = async () => {
    if (!pagination.hasNextPage || isLoading) return;

    try {
      setIsLoading(true);
      // Pass the current nextCursor so the server can fetch the next chunk
      const response = await customFetch.get('/trends/top-viewed', {
        params: {
          cursor: pagination.nextCursor,
        },
      });

      const {
        trends: newTrends,
        nextCursor: newNextCursor,
        hasNextPage: newHasNextPage,
      } = response.data;

      setTrends((prev) => [...prev, ...newTrends]);
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

  const guestUser = async () => {
    try {
      const csrfToken = await getCsrfToken(); // fetch CSRF token as in the login page
      await customFetch.post(
        '/auth/guest-login',
        {},
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        }
      );
      toast.success(
        <CustomSuccessToast message={'Welcome to trendFlow as Guest'} />
      );
      return navigate('/dashboard');
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    }
  }; //guestUser signs in using guestLogin controller

  return (
    <Container>
      <SEO
        title="TrendFlow - Find Tech Trends"
        description="TrendFlow helps you track the latest trends in tech."
        url={FRONTEND_BASE_URL}
        img_large={`${FRONTEND_BASE_URL}/og-image.jpg`}
        img_small={`${FRONTEND_BASE_URL}/og-image-twitter.jpg`}
      />
      <StructuredData />
      <div className="container">
        <div>
          <LandingNavbar />
        </div>
        <LandingHero guestUser={guestUser} />
        <LandingServices />
        <LandingAbout />
        <section id="trends"></section>
        <div className="featured-trends">
          {isMobile ? (
            <FeaturedTrendsMobile featuredTrends={trends} />
          ) : (
            <FeaturedTrendsDesktop featuredTrends={trends} />
          )}
          <div ref={lastTrendElementRef}></div>
          <PaginationFeatured
            link="/login"
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
