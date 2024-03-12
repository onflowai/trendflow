import React from 'react';
import { Form, useLoaderData, redirect, useNavigation } from 'react-router-dom';
import {
  Trends,
  SearchTrends,
  CustomSuccessToast,
  CustomErrorToast,
  StatComponent,
  FormComponent,
} from '../components';
import customFetch from '../utils/customFetch';
import { useOutletContext } from 'react-router-dom';
import Container from '../assets/wrappers/ProfileContainer';
import { toast } from 'react-toastify';
import { FcApprove, FcCheckmark, FcLineChart, FcCancel } from 'react-icons/fc';

/**
 * Profile utilizes few components it uses From with encType='multipart/form-data' to pass data with files in this case
 * images.
 * @returns
 */
export const action = async ({ request }) => {
  const formData = await request.formData(); //getting the form data out of the request where it is loaded with react
  const file = formData.get('profile_img'); //pointing to the image upload by user
  if (file && file.size > 50000000) {
    toast.error('image size too large'); //changed to automatic compression on backend and user can upload whatever image with npm sharp
    return null;
  }
  try {
    await customFetch.patch('users/update-user', formData);
    toast.success(
      <CustomSuccessToast message={'Profile Updated Successfully'} />
    );
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
  }
  return null;
};

const Profile = () => {
  const { user, stats } = useOutletContext();
  const { username, name, lastName, email } = user;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <>
      <StatComponent
        user={user.name}
        stats={[
          {
            title: 'Approved Trends',
            value: stats.approvedTrends,
            icon: <FcApprove />,
            change: 1.01,
          },
          {
            title: 'Total Trend Views',
            value: stats.totalTrendViews,
            icon: <FcLineChart />,
            change: -1.01,
          },
          {
            title: 'Submitted Trends',
            value: stats.submittedTrends,
            icon: <FcCheckmark />,
            change: 1.01,
          },
          {
            title: 'Total Site Trends',
            value: stats.totalSiteTrends,
            icon: <FcCancel />,
            change: 1.01,
          },
        ]}
      />
      <SearchTrends />
      <Form method="post" className="form" encType="multipart/form-data">
        <h4 type="text" name="username">
          {username}
        </h4>
        <div className="form-center">
          <div className="form-row">
            <label htmlFor="avatar" className="form-label">
              Select an image file (max 0.5 MB)
            </label>
            <input
              type="file"
              name="profile_img"
              id="profile_img"
              className="form-input"
              accept="image/*"
            />
          </div>
          <FormComponent
            type="text"
            name="name"
            defaultValue={name}
          ></FormComponent>
          <FormComponent
            type="email"
            name="email"
            defaultValue={email}
          ></FormComponent>
          <FormComponent
            type="text"
            name="lastName"
            defaultValue={lastName}
          ></FormComponent>
          <button
            className="btn btn-block from-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'submitting...' : 'submit'}
          </button>
        </div>
      </Form>
    </>
  );
};

export default Profile;
