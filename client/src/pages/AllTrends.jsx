import React, { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  Trends,
  SEOProtected,
  FilterTrends,
  CustomErrorToast,
  PaginationComponent,
} from '../components';
import customFetch from '../utils/customFetch';
import useLocalStorage from '../hooks/useLocalStorage';
import { useLoaderData } from 'react-router-dom';
import { CombinedProvider } from '../context/CombinedContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useSearchContext } from '../context/SearchContext';

/**
 * Uses Trends and Search Trends using react fragment. Using PublicTrendsContext we are passing the data to Trends.jsx component
 * which displays them all in /dashboard and /admin pages using the Trend.jsx. NOTE: visit Trend.jsx for detailed parameters used
 * @returns
 */
const trendsPerPage = 8; // Pagination Limit
const searchDebounce = 500; // 500ms debounce delay

/**
 * Loader function to fetch trends and saved trends based on query parameters
 * @param {Object} request - request object with URL information
 * @returns {Object} data for trends, saved trends, and search values
 */
export const loader = async ({ request, searchValue }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  if (searchValue) {
    params.search = searchValue;
  }

  // parse the combined sort parameter into individual components
  if (params.sort) {
    const [topRated, topViewed, status, updated] = params.sort.split('|');
    params.topRated = topRated;
    params.topViewed = topViewed;
    params.status = status; // assign status to chartType
    params.updated = updated;
  }
  params.limit = trendsPerPage;
  try {
    const { data: trendsData } = await customFetch.get('/trends', { params });
    const { data: savedTrendsData } = await customFetch.get(
      '/users/saved-trends'
    );
    //NOTE: this is done to reuse the /users/saved-trends GET in Profile as full fetch for user bookmarked trends (instead of _id fetch)
    const savedTrendIds = savedTrendsData.savedTrends.map((trend) => trend._id);
    const trendsWithIcons = trendsData.trends.map((trend) => ({
      ...trend,
    })); // using utility function to prepend base URL to iconUrl with trends tech url for icon
    const { data: savedFiltersData } = await customFetch.get(
      '/users/get-saved-filters'
    );
    const savedFilters = savedFiltersData.filters || {};
    const combinedParams = { ...savedFilters, ...params }; // using saved filters as defaults, but allowing URL params to override
    return {
      trends: {
        trends: trendsWithIcons,
        totalTrends: trendsData.totalTrends,
        pagesNumber: trendsData.pagesNumber,
        currentPage: trendsData.currentPage,
        nextCursor: trendsData.nextCursor,
        hasNextPage: trendsData.hasNextPage,
      },
      savedTrendIds,
      searchValues: combinedParams, //setting combinedParams as searchValues
    };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return { error: error?.response?.data?.msg || 'An error occurred' };
  }
}; //end loader

//function for bookmarking trends for each user
const onSave = async (_id) => {
  try {
    const response = await customFetch.patch('/users/save-trend', { _id });
    if (response.status === 200) {
      toast.success('Trend saved successfully');
    } else {
      toast.error('Failed to save trend');
    }
  } catch (error) {
    toast.error('An error occurred while saving trend');
    console.error(error);
  }
};

//function for removing bookmarked trends
const onRemove = async (_id) => {
  try {
    const response = await customFetch.patch('/users/remove-trend', { _id });
    if (response.status === 200) {
      toast.success('Trend unmarked successfully');
    } else {
      toast.error('Failed to unmarked trend');
    }
  } catch (error) {
    toast.error('An error occurred');
    console.error(error);
  }
};

const AllTrends = () => {
  const navigate = useNavigate();
  const {
    trends: initialTrendsData,
    savedTrendIds,
    error,
    searchValues: initialSearchValues,
    trendCategories,
  } = useLoaderData();
  //const { totalTrends, pagesNumber, currentPage, nextCursor, hasNextPage } = trends;
  const [trendCategory, setTrendCategory] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [isClosed, setIsClosed] = useLocalStorage('isClosed', true); // State to track if the filter is closed in SearchTrends
  const { searchValue } = useSearchContext();
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [trends, setTrends] = useState(initialTrendsData.trends || []);
  const [pagination, setPagination] = useState({
    totalTrends: initialTrendsData.totalTrends,
    pagesNumber: initialTrendsData.pagesNumber,
    currentPage: initialTrendsData.currentPage,
    nextCursor: initialTrendsData.nextCursor,
    hasNextPage: initialTrendsData.hasNextPage,
  });
  const [preloadedPagination, setPreloadedPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [preloadedTrends, setPreloadedTrends] = useState(null); // State for preloaded trends
  const observer = useRef(); // Ref for the Intersection Observer

  const updateSearchValues = (newValues) => {
    const updatedSearchValues = { ...searchValues, ...newValues };
    setSearchValues(updatedSearchValues);
    // Update the URL to reflect new search or sort parameters
    const searchParams = new URLSearchParams(updatedSearchValues);
    navigate(`/dashboard?${searchParams.toString()}`, { replace: true });
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

  //used for fetching a new, filtered list of trends based on updated filters or search terms, replacing the current trends
  const fetchFilteredTrends = async (filters) => {
    try {
      setIsLoading(true);
      const response = await customFetch.get('/trends', {
        params: {
          ...filters, // use updated filters and search params
          limit: trendsPerPage,
        },
      });

      const { trends: filteredTrends, ...newPagination } = response.data;
      setTrends(filteredTrends); // replacing trends with filtered results
      setPagination((prev) => ({ ...prev, ...newPagination }));
    } catch (error) {
      console.error('Error fetching filtered trends:', error);
    } finally {
      setIsLoading(false);
    }
  }; //end fetchFilteredTrends

  // debounced version of fetchFilteredTrends to prevent excessive calls
  const debouncedFetchFilteredTrends = useCallback(
    debounce(fetchFilteredTrends, searchDebounce), // debounce delay in ms
    []
  );

  // when filters change, trigger this to update searchValues
  const onFiltersApply = (filters) => {
    updateSearchValues(filters);
    fetchFilteredTrends(filters); // passing filters directly
  };

  //useEffect for handling searchValue changes
  useEffect(() => {
    if (searchValue !== undefined) {
      const updatedFilters = { ...searchValues, search: searchValue };
      updateSearchValues(updatedFilters);
      debouncedFetchFilteredTrends(updatedFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  //loadMoreTrends used for cursor-based pagination to fetch more results while keeping the existing trends intact
  const loadMoreTrends = async () => {
    if (!pagination.hasNextPage || isLoading) return;

    if (preloadedTrends) {
      applyPreloadedTrends();
      return;
    }

    try {
      setIsLoading(true);
      const response = await customFetch.get('/trends', {
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
  }; //end loadMoreTrends

  //function to apply the preloaded trends
  const applyPreloadedTrends = () => {
    setTrends((prevTrends) => [...prevTrends, ...preloadedTrends]);

    // Update pagination state based on the preloaded data
    setPagination((prev) => ({
      ...prev,
      currentPage: prev.currentPage + 1,
      nextCursor: preloadedPagination.nextCursor,
      hasNextPage: preloadedPagination.hasNextPage,
    }));

    // Clear preloaded data after applying
    setPreloadedTrends(null);
    setPreloadedPagination(null);

    // Start preloading the next page
    preloadNextPage();
  };

  //intersection observer callback
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

  //preloading
  const preloadNextPage = async () => {
    if (!pagination.hasNextPage || preloadedTrends) return;

    try {
      const response = await customFetch.get('/trends', {
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

  // trigger preloading when nearing the bottom
  useEffect(() => {
    if (pagination.hasNextPage) {
      preloadNextPage();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.nextCursor]);

  //fetching the icon data from the node server
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

  // save current filter parameters to users model
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
    navigate('/dashboard');
    try {
      await customFetch.delete('/users/delete-filters');
    } catch (error) {
      toast.error('Failed to reset filters');
      console.error(error);
    }
  };

  //Simple error
  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  return (
    <CombinedProvider value={{ searchValues }}>
      <SEOProtected />
      <FilterTrends
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
        savedTrends={savedTrendIds}
        onSave={onSave}
        onRemove={onRemove}
      />
      <div ref={lastTrendElementRef}></div>
      <PaginationComponent
        isLoading={isLoading}
        hasNextPage={pagination.hasNextPage}
      />
    </CombinedProvider>
  );
};

export default AllTrends;
