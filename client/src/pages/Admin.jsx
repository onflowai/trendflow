import React from 'react';
import { useLoaderData, redirect } from 'react-router-dom';
import { Trends, SearchTrends, CustomErrorToast } from '../components';
import customFetch from '../utils/customFetch';
import Container from '../assets/wrappers/Admin';
import { toast } from 'react-toastify';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/trends/admin/all-trends');
    return { data };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return redirect('/dashboard');
  }
};

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
  const { data } = useLoaderData();
  return (
    <>
      <SearchTrends />
      <Trends trends={data.trends} onApprove={approveTrend} />
    </>
  );
};

export default Admin;
