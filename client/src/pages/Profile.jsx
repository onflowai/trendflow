import React from 'react';
import { Form, useLoaderData, redirect } from 'react-router-dom';
import {
  Trends,
  SearchTrends,
  CustomErrorToast,
  StatComponent,
  FormComponent,
} from '../components';
import customFetch from '../utils/customFetch';
import { useOutletContext } from 'react-router-dom';
import Container from '../assets/wrappers/ProfileContainer';
import { toast } from 'react-toastify';
import { FcApprove, FcCheckmark, FcLineChart, FcCancel } from 'react-icons/fc';

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

const Profile = () => {
  const { user, stats } = useOutletContext();
  const { username, name, lastName, email } = user;
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
      <Form method="post" className="form">
        <h4 className="form-title">Profile</h4>
        <div className="form-center">
          <div className="form-row">
            <label htmlFor="avatar" className="form-label">
              Select an image file (max 0.5 MB)
            </label>
            <input
              type="file"
              id="profile_img"
              className="form-input"
              accept="image/*"
            />
          </div>
          <FormComponent
            type="text"
            name="name"
            defaultValue={username}
          ></FormComponent>
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
        </div>
      </Form>
    </>
  );
};

export default Profile;
