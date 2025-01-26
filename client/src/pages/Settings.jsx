import React, { useState, useEffect, useRef } from 'react';
import { Form, useLoaderData, useNavigation } from 'react-router-dom';
import {
  UserTrends,
  UserSettings,
  SEOProtected,
  UserImgLarge,
  StatComponent,
  FormComponent,
  ProfileHeader,
  CustomErrorToast,
  FormComponentLock,
  CustomSuccessToast,
  ChartSettingsComponent,
} from '../components';
import DarkMode from '../components/DarkMode';
import customFetch from '../utils/customFetch';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // importing UserContext
import { useDashboardContext } from './DashboardLayout';
import Container from '../assets/wrappers/SettingsContainer';
import { toast } from 'react-toastify';
import {
  IoCheckmarkDoneOutline,
  IoEyeOutline,
  IoArrowUp,
  IoAlbumsOutline,
} from 'react-icons/io5';
/**
 * Setting will be used to display App based settings
 * @returns
 */
export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  try {
    // Fetching app stats for the charts
    const chartsResponse = await customFetch.get('/trends/app/stats');
    const chartsData = chartsResponse.data;

    // Return both sets of data
    return {
      charts: chartsData,
      searchValues: { ...params },
    };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return redirect('/dashboard');
  }
};
const Settings = () => {
  const { charts } = useLoaderData();
  const { user, stats } = useOutletContext();
  return (
    <Container>
      <SEOProtected />
      <div>
        <h4>Settings:</h4>
      </div>
      <StatComponent
        stats={[
          {
            title: 'Approved Trends',
            value: stats.approvedTrends,
            icon: <IoCheckmarkDoneOutline />,
          },
          {
            title: 'Total Trend Views',
            value: stats.totalTrendViews,
            icon: <IoEyeOutline />,
          },
          {
            title: 'Submitted Trends',
            value: stats.submittedTrends,
            icon: <IoArrowUp />,
          },
          {
            title: 'Total Site Trends',
            value: stats.totalSiteTrends,
            icon: <IoAlbumsOutline />,
          },
        ]}
      />
      {charts.monthTrends?.length > 1 && (
        <ChartSettingsComponent data={charts} title="App Stats:" />
      )}
      <div className="quick-actions">
        <div className="btn-container">
          <DarkMode className="dark-mode" />
        </div>
        {/* Placeholder for additional quick tools */}
        <div className="btn-container">
          <button className="quick-tool">Placeholder Tool 1</button>
        </div>
        <div className="btn-container">
          <button className="quick-tool">Placeholder Tool 2</button>
        </div>
      </div>
      {/* TABS START HERE */}
    </Container>
  );
};

export default Settings;
