import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLoaderData, redirect, useNavigate } from 'react-router-dom';
import {
  Trends,
  FilterTrends,
  CustomErrorToast,
  StatComponent,
  ChartAdminComponent,
  CustomSuccessToast,
  PaginationComponent,
} from '../components';
import useLocalStorage from '../hooks/useLocalStorage';
import customFetch from '../utils/customFetch';
import { useOutletContext } from 'react-router-dom';
import Container from '../assets/wrappers/AdminContainer';
import { toast } from 'react-toastify';
import { CombinedProvider } from '../context/CombinedContext.jsx';
import { FcApprove, FcCheckmark, FcLineChart, FcCancel } from 'react-icons/fc';
import { useSearchContext } from '../context/SearchContext';

/**
 * Loader function to fetch trends and stats for the admin page
 * @param {Object} request - request object with URL information
 * @returns {Object} data for trends, stats, charts, and search values
 */
export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  // parse the combined sort parameter into individual components
  if (params.sort) {
    const [topRated, topViewed, status, updated] = params.sort.split('|');
    params.topRated = topRated;
    params.topViewed = topViewed;
    params.status = status;
    params.updated = updated;
  }
  params.limit = trendsPerPage;

  try {
    // Fetching all trends with pagination data
    const trendsResponse = await customFetch.get('trends/admin/all-trends', {
      params,
    });
    const trendsData = trendsResponse.data;

    // Fetching basic application stats
    const statsResponse = await customFetch.get('users/admin/app-stats');
    const statsData = statsResponse.data;

    // fetching stats for the charts
    const chartsResponse = await customFetch.get('/trends/admin/stats');
    const chartsData = chartsResponse.data;

    // Return all data
    return {
      trends: {
        trends: trendsData.trends,
        totalTrends: trendsData.totalTrends,
        pagesNumber: trendsData.pagesNumber,
        currentPage: trendsData.currentPage,
        nextCursor: trendsData.nextCursor,
        hasNextPage: trendsData.hasNextPage,
      },
      stats: statsData,
      charts: chartsData,
      searchValues: { ...params },
    };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return redirect('/dashboard');
  }
};

const trendsPerPage = 8; // pagination Limit
const searchDebounce = 500; // 500ms debounce delay

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const isAdminPage = user.role === 'admin';

  const {
    trends: initialTrendsData,
    stats,
    charts,
    searchValues: initialSearchValues,
  } = useLoaderData();

  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [trends, setTrends] = useState(initialTrendsData.trends || []);
  const [pagination, setPagination] = useState({
    totalTrends: initialTrendsData.totalTrends,
    pagesNumber: initialTrendsData.pagesNumber,
    currentPage: initialTrendsData.currentPage,
    nextCursor: initialTrendsData.nextCursor,
    hasNextPage: initialTrendsData.hasNextPage,
  });
  const [isLoading, setIsLoading] = useState(false); // state to track loading
  const [preloadedTrends, setPreloadedTrends] = useState(null); // state for preloaded trends
  const [preloadedPagination, setPreloadedPagination] = useState(null);
  const observer = useRef(); // ref for the Intersection Observer
  const { searchValue } = useSearchContext();

  const [loadingSlug, setLoadingSlug] = useState(null);
  const [trendCategory, setTrendCategory] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [isClosed, setIsClosed] = useLocalStorage('isClosed', true); // state to track if the filter is closed in SearchTrends

  // function to update search values and navigate
  const updateSearchValues = (newValues) => {
    const updatedSearchValues = { ...searchValues, ...newValues };
    setSearchValues(updatedSearchValues);
    console.log('Updated searchValues:', updatedSearchValues);
    // Update the URL to reflect new search or sort parameters
    const searchParams = new URLSearchParams(updatedSearchValues);
    navigate(`/dashboard/admin?${searchParams.toString()}`, { replace: true });
  };

  // debounce function to limit the rate at which fetchFilteredTrends is called
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // fetch filtered trends based on updated filters or search terms
  const fetchFilteredTrends = async (filters) => {
    try {
      setIsLoading(true);
      const response = await customFetch.get('trends/admin/all-trends', {
        params: {
          ...filters, // updated filters and search params
          limit: trendsPerPage,
        },
      });

      const { trends: filteredTrends, ...newPagination } = response.data;
      setTrends(filteredTrends); // replace trends with filtered results
      setPagination((prev) => ({ ...prev, ...newPagination }));
    } catch (error) {
      console.error('Error fetching filtered trends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // debounced version of fetchFilteredTrends to prevent excessive calls
  const debouncedFetchFilteredTrends = useCallback(
    debounce(fetchFilteredTrends, searchDebounce),
    []
  );

  // when filters change, update searchValues and fetch trends
  const onFiltersApply = (filters) => {
    updateSearchValues(filters);
    fetchFilteredTrends(filters);
  };

  // handle searchValue changes from the SearchContext
  useEffect(() => {
    if (searchValue !== undefined) {
      const updatedFilters = { ...searchValues, search: searchValue };
      updateSearchValues(updatedFilters);
      debouncedFetchFilteredTrends(updatedFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  // load more trends when the user scrolls to the bottom
  const loadMoreTrends = async () => {
    if (!pagination.hasNextPage || isLoading) return;

    if (preloadedTrends) {
      applyPreloadedTrends();
      return;
    }

    try {
      setIsLoading(true);
      const response = await customFetch.get('trends/admin/all-trends', {
        params: {
          ...searchValues, // Use updated search and sort params
          cursor: pagination.nextCursor,
          limit: trendsPerPage,
        },
      });

      const { trends: newTrends, ...newPagination } = response.data;
      setTrends((prevTrends) => [...prevTrends, ...newTrends]);
      setPagination((prev) => ({ ...prev, ...newPagination }));
    } catch (error) {
      console.error('Error loading more trends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // apply preloaded trends when available
  const applyPreloadedTrends = () => {
    setTrends((prevTrends) => [...prevTrends, ...preloadedTrends]);

    // update pagination state based on the preloaded data
    setPagination((prev) => ({
      ...prev,
      currentPage: prev.currentPage + 1,
      nextCursor: preloadedPagination.nextCursor,
      hasNextPage: preloadedPagination.hasNextPage,
    }));

    // clear preloaded data after applying
    setPreloadedTrends(null);
    setPreloadedPagination(null);

    // start preloading the next page
    preloadNextPage();
  };

  // intersection Observer callback for infinite scrolling
  const lastTrendElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && pagination.hasNextPage) {
            loadMoreTrends();
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 1.0,
        }
      );
      if (node) observer.current.observe(node);
    },
    [isLoading, pagination.hasNextPage, preloadedTrends]
  );

  // preload the next page of trends
  const preloadNextPage = async () => {
    if (!pagination.hasNextPage || preloadedTrends) return;

    try {
      const response = await customFetch.get('trends/admin/all-trends', {
        params: {
          ...searchValues,
          cursor: pagination.nextCursor,
          limit: trendsPerPage,
        },
      });

      setPreloadedTrends(response.data.trends);
      setPreloadedPagination({
        nextCursor: response.data.nextCursor,
        hasNextPage: response.data.hasNextPage,
      });
    } catch (error) {
      console.error('Error preloading next trends:', error);
    }
  };

  // trigger preloading when pagination changes
  useEffect(() => {
    if (pagination.hasNextPage) {
      preloadNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.nextCursor]);

  // fetching the icon data from the server
  useEffect(() => {
    const fetchData = async () => {
      if (!isClosed) {
        try {
          const response = await customFetch.get('trends/icon-data');
          const { TREND_CATEGORY, TECHNOLOGIES } = response.data;
          setTrendCategory(Object.values(TREND_CATEGORY));
          setTechnologies(Object.values(TECHNOLOGIES));
        } catch (error) {
          console.error('Error fetching trend icon-data:', error);
        }
      }
    };
    fetchData();
  }, [isClosed]);

  // approve a trend
  const approveTrend = async (slug) => {
    try {
      setLoadingSlug(slug); // Start loading
      await customFetch.patch(`trends/${slug}/approve`);
      // Handle successful approval
      toast.success(<CustomSuccessToast message={'Trend Approved'} />);
      // Refresh the trends list
      fetchFilteredTrends(searchValues);
    } catch (error) {
      // Handle error
      toast.error(error?.response?.data?.msg || 'Error approving trend');
    } finally {
      setLoadingSlug(null); // Stop loading
    }
  };

  // remove a trend
  const removeTrend = async (slug) => {
    try {
      setLoadingSlug(slug); // Start loading
      await customFetch.delete(`/trends/edit/${slug}`);
      // Handle successful deletion
      toast.success('Trend deleted successfully!');
      // Refresh the trends list
      fetchFilteredTrends(searchValues);
    } catch (error) {
      // Handle error
      toast.error(error?.response?.data?.msg || 'Error deleting trend');
    } finally {
      setLoadingSlug(null); // Stop loading
    }
  };

  return (
    <Container>
      <StatComponent
        user={user.name}
        stats={[
          {
            title: 'Total Users',
            value: stats.users,
            icon: <FcApprove />,
            change: 1.01,
          },
          {
            title: 'Total Trends',
            value: stats.trends,
            icon: <FcLineChart />,
            change: -1.01,
          },
          {
            title: 'Total Approved Trends',
            value: stats.approved,
            icon: <FcCheckmark />,
            change: 1.01,
          },
          {
            title: 'Total Unapproved Trends',
            value: stats.unapproved,
            icon: <FcCancel />,
            change: 1.01,
          },
        ]}
      />
      {charts.monthTrends?.length > 1 && (
        <ChartAdminComponent data={charts} title="Stats:" />
      )}
      <CombinedProvider value={{ trends, searchValues }}>
        <FilterTrends
          isAdminPage={isAdminPage}
          onFiltersApply={onFiltersApply}
          trendCategory={trendCategory}
          technologies={technologies}
          isClosed={isClosed}
          setIsClosed={setIsClosed}
        />
        <Trends
          trends={trends}
          onDelete={removeTrend}
          onApprove={approveTrend}
          isAdminPage={isAdminPage}
          loadingSlug={loadingSlug}
        />
        <div ref={lastTrendElementRef}></div>
        <PaginationComponent
          isLoading={isLoading}
          hasNextPage={pagination.hasNextPage}
        />
      </CombinedProvider>
    </Container>
  );
};

export default Admin;
