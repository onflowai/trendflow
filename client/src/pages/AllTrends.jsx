import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Trends, FilterTrends, CustomErrorToast, Footer } from '../components';
import customFetch from '../utils/customFetch';
import useLocalStorage from '../hooks/useLocalStorage';
import { getFullIconUrl } from '../utils/urlHelper';
import { useLoaderData } from 'react-router-dom';
import { CombinedProvider } from '../context/CombinedContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useSearchContext } from '../context/SearchContext';
/**
 * Uses Trends and Search Trends using react fragment. Using PublicTrendsContext we are passing the data to Trends.jsx component
 * which displays them all in /dashboard and /admin pages using the Trend.jsx. NOTE: visit Trend.jsx for detailed parameters used
 * @returns
 */
const trendsPerPage = 6; // Pagination Limit
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
    console.log('trendsData', trendsData);
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
  const { trends, savedTrendIds, error, searchValues, trendCategories } =
    useLoaderData();
  const { totalTrends, pagesNumber, currentPage, nextCursor, hasNextPage } =
    trends;
  const [trendCategory, setTrendCategory] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [isClosed, setIsClosed] = useLocalStorage('isClosed', true); // State to track if the filter is closed in SearchTrends
  const { searchValue } = useSearchContext();
  useEffect(() => {
    const searchParams = new URLSearchParams(searchValues); // Get current URL parameters

    // Update only if the searchValue is different from the URL param
    if (searchValue && searchParams.get('search') !== searchValue) {
      searchParams.set('search', searchValue); // Add or update 'search' param
      navigate(`/dashboard?${searchParams.toString()}`, { replace: true }); // Update URL
    } else if (!searchValue && searchParams.has('search')) {
      // Remove 'search' if searchValue is empty and param exists
      searchParams.delete('search');
      navigate(`/dashboard?${searchParams.toString()}`, { replace: true });
    }
  }, [searchValue, searchValues, navigate]);
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
    <CombinedProvider value={{ trends, searchValues }}>
      <FilterTrends
        trendCategory={trendCategory}
        technologies={technologies}
        isClosed={isClosed}
        setIsClosed={setIsClosed}
        saveFilters={saveFilters}
        resetFilters={resetFilters}
      />
      <Trends
        trends={trends.trends}
        savedTrends={savedTrendIds}
        onSave={onSave}
        onRemove={onRemove}
        totalTrends={totalTrends}
        pagesNumber={pagesNumber}
        currentPage={currentPage}
        nextCursor={nextCursor}
        hasNextPage={hasNextPage}
      />
    </CombinedProvider>
  );
};

export default AllTrends;
