import React from 'react';
import { toast } from 'react-toastify';
import { Trends, SearchTrends, CustomErrorToast } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';
/**
 * Uses Trends and Search Trends using react fragment. Using PublicTrendsContext we are passing the data to Trends.jsx component
 * which displays them all in /dashboard and /admin pages using the Trend.jsx. NOTE: visit Trend.jsx for detailed parameters used
 * @returns
 */
export const loader = async () => {
  try {
    const { data } = await customFetch.get('/trends');
    return { data };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return error;
  }
};

const AllTrends = () => {
  const { data } = useLoaderData();
  return (
    <>
      <SearchTrends />
      <Trends trends={data.trends} />
    </>
  );
};

export default AllTrends;
