import React, { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  Trends,
  FilterTrends,
  SEOProtected,
  StatComponent,
  AddTrendModal,
  CustomErrorToast,
  CustomSuccessToast,
  PaginationComponent,
  ChartAdminComponent,
} from '../components';
import customFetch from '../utils/customFetch';
import useLocalStorage from '../hooks/useLocalStorage';
import { useLoaderData, redirect, useNavigate } from 'react-router-dom';
import { CombinedProvider } from '../context/CombinedContext.jsx';
import { useSearchContext } from '../context/SearchContext';
import { useOutletContext } from 'react-router-dom';
import Container from '../assets/wrappers/AdminContainer';
import {
  IoPeopleOutline,
  IoAlbumsOutline,
  IoCheckmarkDoneOutline,
  IoAlbums,
} from 'react-icons/io5';

const trendsPerPage = 8; // pagination Limit
const searchDebounce = 500; // 500ms debounce delay

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
    const trendsResponse = await customFetch.get('trends/admin/all-trends', {
      params,
    });
    const trendsData = trendsResponse.data;

    const statsResponse = await customFetch.get('users/admin/app-stats');
    const statsData = statsResponse.data;

    const chartsResponse = await customFetch.get('/trends/admin/stats');
    const chartsData = chartsResponse.data;
    // Fetch saved filters
    const { data: savedFiltersData } = await customFetch.get(
      '/users/get-saved-filters'
    );
    const savedFilters = savedFiltersData.filters || {};
    const combinedParams = { ...savedFilters, ...params }; // saved filters as defaults, but allow URL params to override

    return {
      trends: {
        trends: trendsData.trends,
        totalTrends: trendsData.totalTrends,
        // pagesNumber: trendsData.pagesNumber,
        // currentPage: trendsData.currentPage,
        nextCursor: trendsData.nextCursor,
        hasNextPage: trendsData.hasNextPage,
      },
      stats: statsData,
      charts: chartsData,
      searchValues: combinedParams,
    };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    const msg = error?.response?.data?.msg ?? 'An error occurred';
    return {
      trends: {
        trends: [],
        totalTrends: 0,
        nextCursor: null,
        hasNextPage: false,
      },
      stats: {
        users: 0,
        trends: 0,
        approved: 0,
        unapproved: 0,
      },
      charts: {
        monthUsers: [],
        monthTrends: [],
        guestUserVisit: [],
      },
      searchValues: {},
      error: msg,
    };
  }
};

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

  const [searchValues, setSearchValues] = useState(initialSearchValues); // filter state
  const [trends, setTrends] = useState(initialTrendsData.trends || []); // storing the trends

  const [pagination, setPagination] = useState({
    totalTrends: initialTrendsData.totalTrends,
    nextCursor: initialTrendsData.nextCursor, // can be null if no more pages
    hasNextPage: initialTrendsData.hasNextPage,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [preloadedTrends, setPreloadedTrends] = useState(null);
  const [preloadedPagination, setPreloadedPagination] = useState(null);
  const observer = useRef(); // Ref for the Intersection Observer

  const { searchValue } = useSearchContext();
  const [loadingSlug, setLoadingSlug] = useState(null);
  const [trendCategory, setTrendCategory] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [isClosed, setIsClosed] = useLocalStorage('isClosed', true); // state to track if the filter is closed in FilterTrends

  const [showAddTrendModal, setShowAddTrendModal] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [jsonData, setJsonData] = useState(null);

  // function to update search values and also push to URL
  const updateSearchValues = (newValues) => {
    const updatedSearchValues = { ...searchValues, ...newValues };
    setSearchValues(updatedSearchValues);
    // Update the URL to reflect new search or sort parameters (reflect in url)
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

      // Reset preloaded data before fetching new trends
      setPreloadedTrends(null);
      setPreloadedPagination(null);

      const response = await customFetch.get('trends/admin/all-trends', {
        params: {
          ...filters, // use updated filters and search params
          limit: trendsPerPage,
        },
      });

      // response.data = { trends, totalTrends, nextCursor, hasNextPage }
      const { trends: newTrends, ...newPagination } = response.data;

      // replace existing trends
      setTrends(newTrends);
      setPagination({
        totalTrends: newPagination.totalTrends,
        nextCursor: newPagination.nextCursor,
        hasNextPage: newPagination.hasNextPage,
      });
    } catch (error) {
      console.error('Error fetching filtered trends:', error);
    } finally {
      setIsLoading(false);
    }
  }; //end fetchFilteredTrends

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

  // infinite Scroll: load more trends when the user scrolls to the bottom
  const loadMoreTrends = async () => {
    if (!pagination.hasNextPage || isLoading) return;

    if (preloadedTrends) {
      applyPreloadedTrends();
      return;
    } // if preloaded the next page apply it now

    try {
      setIsLoading(true);
      const response = await customFetch.get('trends/admin/all-trends', {
        params: {
          ...searchValues, // Use updated search and sort params
          limit: trendsPerPage,
          cursor: pagination.nextCursor, // THIS is the key for cursor-based
        },
      });

      const { trends: newTrends, ...newPagination } = response.data;

      setTrends((prev) => [...prev, ...newTrends]);
      setPagination((prev) => ({
        ...prev,
        // keep totalTrends if you want
        totalTrends: newPagination.totalTrends,
        nextCursor: newPagination.nextCursor,
        hasNextPage: newPagination.hasNextPage,
      }));
    } catch (error) {
      console.error('Error loading more trends:', error);
    } finally {
      setIsLoading(false);
    }
  }; //end loadMoreTrends

  // optional: preloading the next page in the background
  const preloadNextPage = async () => {
    if (!pagination.hasNextPage || preloadedTrends) return;

    try {
      const response = await customFetch.get('trends/admin/all-trends', {
        params: {
          ...searchValues,
          limit: trendsPerPage,
          cursor: pagination.nextCursor,
        },
      });

      setPreloadedTrends(response.data.trends);
      setPreloadedPagination({
        totalTrends: response.data.totalTrends,
        nextCursor: response.data.nextCursor,
        hasNextPage: response.data.hasNextPage,
      });
    } catch (error) {
      console.error('Error preloading next trends:', error);
    }
  }; //end preloadNextPage

  // apply preloaded trends when available
  const applyPreloadedTrends = () => {
    setTrends((prev) => [...prev, ...preloadedTrends]);

    // update pagination state based on the preloaded data
    setPagination((prev) => ({
      ...prev,
      totalTrends: preloadedPagination.totalTrends,
      nextCursor: preloadedPagination.nextCursor,
      hasNextPage: preloadedPagination.hasNextPage,
    }));

    // clear preloaded data after applying
    setPreloadedTrends(null);
    setPreloadedPagination(null);

    preloadNextPage(); //load the next batch in the background
  }; //end applyPreloadedTrends

  // trigger preloading when pagination changes
  useEffect(() => {
    if (pagination.hasNextPage) {
      preloadNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.nextCursor]);

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
  ); //end lastTrendElementRef

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
      setLoadingSlug(slug); // start loading
      await customFetch.patch(`trends/${slug}/approve`);
      toast.success(<CustomSuccessToast message="Trend Approved" />);
      fetchFilteredTrends(searchValues); // refresh the trends
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Error approving trend');
    } finally {
      setLoadingSlug(null); // stop loading
    }
  }; //end approveTrend

  // Modify manualApproveTrend to accept JSON data
  const manualApproveTrend = async (slug, data) => {
    try {
      setLoadingSlug(slug); // start loading
      setShowAddTrendModal(false); //close modal
      await customFetch.patch(`trends/${slug}/manual-approve`, { data });
      toast.success(<CustomSuccessToast message="Trend Manually Approved" />);
      fetchFilteredTrends(searchValues); // refresh the trends list
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Error approving trend');
    } finally {
      setLoadingSlug(null); // stop loading
    }
  }; //end manualApproveTrend

  // remove a trend
  const removeTrend = async (slug) => {
    try {
      setLoadingSlug(slug);
      await customFetch.delete(`/trends/edit/${slug}`);
      toast.success('Trend deleted successfully!');

      // reset preloaded data
      setPreloadedTrends(null);
      setPreloadedPagination(null);

      // refresh the trends list
      fetchFilteredTrends(searchValues);
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Error deleting trend');
    } finally {
      setLoadingSlug(null); //stop loading
    }
  }; //end removeTrend

  // save current filter parameters to user's model
  const saveFilters = async (filters) => {
    try {
      await customFetch.post('/users/save-filters', { filters });
      toast.success('Filters saved successfully');
    } catch (error) {
      toast.error('Failed to save filters');
      console.error(error);
    }
  };

  // reset filters: clear state, URL params, and saved data in MongoDB
  const resetFilters = async () => {
    navigate('/dashboard/admin');
    try {
      await customFetch.delete('/users/delete-filters');
      setSearchValues({}); // reset searchValues to default
      fetchFilteredTrends({}); // fetch trends with default filters
    } catch (error) {
      toast.error('Failed to reset filters');
      console.error(error);
    }
  };

  // function to handle manual approve and open modal
  const handleApproveManual = (slug) => {
    setSelectedSlug(slug); //set the selected slug
    setShowAddTrendModal(true); //open the modal
  };

  // function to handle adding trend after manual approval
  const handleAddTrend = () => {
    fetchFilteredTrends(searchValues); // refresh the trends list
  };

  return (
    <Container>
      <SEOProtected />
      <StatComponent
        user={user.name}
        stats={[
          {
            title: 'Total Users',
            value: stats.users,
            icon: <IoPeopleOutline />,
          },
          {
            title: 'Total Trends',
            value: stats.trends,
            icon: <IoAlbumsOutline />,
          },
          {
            title: 'Total Approved Trends',
            value: stats.approved,
            icon: <IoCheckmarkDoneOutline />,
          },
          {
            title: 'Total Unapproved Trends',
            value: stats.unapproved,
            icon: <IoAlbums />,
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
          saveFilters={saveFilters}
          resetFilters={resetFilters}
        />
        <Trends
          trends={trends}
          onDelete={removeTrend}
          onApprove={approveTrend}
          isAdminPage={isAdminPage}
          loadingSlug={loadingSlug}
          onApproveManual={handleApproveManual}
        />
        <div ref={lastTrendElementRef} style={{ height: '1px' }} />
        <PaginationComponent
          isLoading={isLoading}
          hasNextPage={pagination.hasNextPage}
        />
      </CombinedProvider>
      {showAddTrendModal && (
        <AddTrendModal
          onClose={() => setShowAddTrendModal(false)}
          onAdd={handleAddTrend}
          slug={selectedSlug}
          onManualApprove={manualApproveTrend}
        />
      )}
    </Container>
  );
};

export default Admin;
