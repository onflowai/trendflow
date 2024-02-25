import React from 'react';
import {
  FormComponent,
  FormSelector,
  CustomErrorToast,
  CustomSuccessToast,
} from '../components';
import Container from '../assets/wrappers/DashboardForm';
import { useLoaderData, useParams } from 'react-router-dom';
import { TREND_CATEGORY, TECHNOLOGIES } from '../../../utils/constants';
import { Form, useNavigation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
/**
 * Edit Page is only accessible to admin user to edit certain felids of the trend and POST them
 * @returns
 *
 */
//Fetching the trend data
export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/trends/${params.slug}`);
    return data;
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return redirect('/dashboard');
  }
};

export const action = async () => {
  return null;
};

const EditTrend = () => {
  const { trendObject } = useLoaderData();
  console.log(trendObject);
  return <h1>EditTrend Page</h1>;
};

export default EditTrend;
