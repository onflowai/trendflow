import React from 'react';
import {
  FormComponent,
  FormSelector,
  CustomErrorToast,
  CustomSuccessToast,
} from '../components';
import Container from '../assets/wrappers/DashboardFormContainer';
import { TREND_CATEGORY, TECHNOLOGIES } from '../../../utils/constants';
import { Form, redirect, useLoaderData, useNavigate } from 'react-router-dom';
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
    const { data } = await customFetch.get(`/trends/edit/${params.slug}`);
    return data;
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return redirect('/dashboard');
  }
};
//action for editing the trend
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.patch(`/trends/edit/${params.slug}`, data);
    toast.success(<CustomSuccessToast message={'Trend Edited'} />);
    return redirect('/dashboard');
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return error;
  }
};

const EditTrend = () => {
  const { trendObject } = useLoaderData();
  const navigate = useNavigate();
  const navigation = useLoaderData();
  const isSubmitting = navigation.state === 'submitting';

  const handleDelete = async () => {
    try {
      await customFetch.delete(`/trends/edit/${trendObject.slug}`);
      toast.success(<CustomSuccessToast message={'Trend Deleted'} />);
      navigate('/dashboard'); // Redirect after deletion
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    }
  };

  return (
    <Container>
      <Form method="post" className="form">
        <h4 className="form-title">Edit Trend:</h4>
        <div className="form-center">
          <FormComponent
            type="text"
            name="trend"
            defaultValue={trendObject.trend}
          />
          <FormSelector
            labelText="Category"
            name="trendCategory"
            defaultValue={trendObject.trendCategory}
            list={Object.values(TREND_CATEGORY)}
          />
          <FormSelector
            labelText="Technology"
            name="trendTech"
            defaultValue={trendObject.trendTech}
            list={Object.values(TECHNOLOGIES)}
          />
          <button
            type="submit"
            className="btn btn-block from-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'submitting...' : 'submit'}
          </button>
          <button type="button" onClick={handleDelete} className="btn info-btn">
            Delete
          </button>
        </div>
      </Form>
    </Container>
  );
};

export default EditTrend;
