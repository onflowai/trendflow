import React, { useState, useEffect, useRef } from 'react';
import { Form, useLoaderData, useNavigation } from 'react-router-dom';
import {
  CustomSuccessToast,
  FormComponentLock,
  CustomErrorToast,
  UserSettings,
  StatComponent,
  FormComponent,
  ProfileHeader,
  UserImgLarge,
  UserTrends,
} from '../components';
import customFetch from '../utils/customFetch';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // importing UserContext
import { useDashboardContext } from './DashboardLayout';
import Container from '../assets/wrappers/SettingsContainer';
import { toast } from 'react-toastify';
import { FcApprove, FcCheckmark, FcLineChart, FcCancel } from 'react-icons/fc';
/**
 * Setting will be used to display App based settings
 * @returns
 */
const Settings = () => {
  const { user, stats } = useOutletContext();
  return (
    <Container>
      <StatComponent
        stats={[
          {
            title: 'Approved Trends',
            value: stats.approvedTrends,
            icon: <FcApprove />,
          },
          {
            title: 'Total Trend Views',
            value: stats.totalTrendViews,
            icon: <FcLineChart />,
          },
          {
            title: 'Submitted Trends',
            value: stats.submittedTrends,
            icon: <FcCheckmark />,
          },
          {
            title: 'Total Site Trends',
            value: stats.totalSiteTrends,
            icon: <FcCancel />,
          },
        ]}
      />
      <div>
        <h1>Settings Page</h1>
        <p>Here you can manage your settings.</p>
      </div>
    </Container>
  );
};

export default Settings;
