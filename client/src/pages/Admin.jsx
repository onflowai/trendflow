import React from 'react';
import { useLoaderData, redirect } from 'react-router-dom';
import {
  Trends,
  SearchTrends,
  CustomErrorToast,
  StatObject,
} from '../components';
import customFetch from '../utils/customFetch';
import { useOutletContext } from 'react-router-dom';
import Container from '../assets/wrappers/AdminContainer';
import { toast } from 'react-toastify';

export const loader = async () => {
  // try {
  //   const { data } = await customFetch.get('/trends/admin/all-trends');
  //   return { data };
  // } catch (error) {
  //   toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
  //   return redirect('/dashboard');
  // }
  try {
    // Fetching all trends
    const trendsResponse = await customFetch.get('trends/admin/all-trends');
    const trendsData = trendsResponse.data;

    // Fetching application stats
    const statsResponse = await customFetch.get('users/admin/app-stats');
    const statsData = statsResponse.data;

    // Return both sets of data
    return { trends: trendsData.trends, stats: statsData };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return redirect('/dashboard');
  }
};
//Approved Trends,  Total Trend Views, Submitted Trends, Total Site Trends
const Admin = () => {
  const approveTrend = async (slug) => {
    try {
      await customFetch.patch(`trends/${slug}/approve`);
      // Handle successful approval (e.g., show a success message, refresh the list of trends, etc.)
      toast.success('Trend approved successfully!');
    } catch (error) {
      // Handle error (e.g., show an error message)
      toast.error(error?.response?.data?.msg || 'Error approving trend');
    }
  };
  const { trends, stats } = useLoaderData();
  const { user } = useOutletContext();
  const isAdminPage = user.role === 'admin';
  console.log(user);
  return (
    <>
      <StatObject stats={stats} />
      <SearchTrends />
      <Trends
        trends={trends}
        onApprove={approveTrend}
        isAdminPage={isAdminPage}
      />
    </>
  );
};

export default Admin;
