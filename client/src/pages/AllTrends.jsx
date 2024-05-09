import React from 'react';
import { toast } from 'react-toastify';
import { Trends, SearchTrends, CustomErrorToast } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import { useContext, createContext } from 'react';
/**
 * Uses Trends and Search Trends using react fragment. Using PublicTrendsContext we are passing the data to Trends.jsx component
 * which displays them all in /dashboard and /admin pages using the Trend.jsx. NOTE: visit Trend.jsx for detailed parameters used
 * @returns
 */
export const loader = async () => {
  try {
    const { data: trendsData } = await customFetch.get('/trends');
    //NOTE: this is done to reuse the /users/saved-trends GET in Profile as full fetch for user bookmarked trends (instead of _id fetch)
    // const savedTrendIds = savedTrendsData.savedTrends.map((trend) => trend._id);
    return {
      trends: trendsData,
    };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return { error: error?.response?.data?.msg || 'An error occurred' };
  }
};
//function for bookmarking trends for each user
const onSave = async (_id) => {
  console.log('ID in onSave: ', _id);
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
console.log('ON SAVE: ', onSave);

const AllTrends = () => {
  const { user } = useOutletContext();
  const savedTrendIds = user.savedTrends;
  const { trends, error } = useLoaderData();
  if (error) {
    return <div>Error loading data: {error}</div>;
  }
  return (
    <>
      <SearchTrends />
      <Trends
        trends={trends.trends}
        savedTrends={savedTrendIds}
        onSave={onSave}
      />
    </>
  );
};

export default AllTrends;
