import React from 'react';
import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';
/**
 * Trends Component displays all of the Trends in the AllTrends page
 * @returns
 */

export const loader = async () => {
  return null;
};

function Trends() {
  return <div>Trends</div>;
}

export default Trends;
