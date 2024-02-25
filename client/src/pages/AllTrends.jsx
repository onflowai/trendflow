import React from 'react';
import { toast } from 'react-toastify';
import { Trends, SearchTrends, CustomErrorToast } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';
/**
 * Uses Trends and Search Trends using react fragment. Using AllTrendsContext we are passing the data to Trends component
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

const AllTrendsContext = createContext();

const AllTrends = () => {
  const { data } = useLoaderData();
  return (
    <AllTrendsContext.Provider value={{ data }}>
      <SearchTrends />
      <Trends />
    </AllTrendsContext.Provider>
  );
};

export const useAllTrendsContext = () => useContext(AllTrendsContext);

export default AllTrends;
