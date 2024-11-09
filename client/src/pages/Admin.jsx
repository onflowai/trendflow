import React, { useEffect, useState } from 'react';
import { useLoaderData, redirect } from 'react-router-dom';
import {
  Trends,
  FilterTrends,
  CustomErrorToast,
  StatComponent,
  ChartAdminComponent,
  CustomSuccessToast,
} from '../components';
import useLocalStorage from '../hooks/useLocalStorage';
import customFetch from '../utils/customFetch';
import { useOutletContext } from 'react-router-dom';
import Container from '../assets/wrappers/AdminContainer';
import { toast } from 'react-toastify';
import { CombinedProvider } from '../context/CombinedContext.jsx';
import { FcApprove, FcCheckmark, FcLineChart, FcCancel } from 'react-icons/fc';

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  try {
    // Fetching all trends
    const trendsResponse = await customFetch.get('trends/admin/all-trends', {
      params,
    });
    const trendsData = trendsResponse.data;

    // Fetching basic application stats
    const statsResponse = await customFetch.get('users/admin/app-stats');
    const statsData = statsResponse.data;

    // Fetching stats for the charts
    const chartsResponse = await customFetch.get('/trends/admin/stats');
    const chartsData = chartsResponse.data;

    // Return both sets of data
    return {
      trends: trendsData.trends,
      stats: statsData,
      charts: chartsData,
      searchValues: { ...params },
    };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return redirect('/dashboard');
  }
};
//Approved Trends,  Total Trend Views, Submitted Trends, Total Site Trends
const Admin = () => {
  const [loadingSlug, setLoadingSlug] = useState(null);
  const [trendCategory, setTrendCategory] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [isClosed, setIsClosed] = useLocalStorage('isClosed', true); // State to track if the filter is closed in SearchTrends
  //fetching the icon data from the node server
  useEffect(() => {
    const fetchData = async () => {
      if (!isClosed) {
        try {
          const response = await customFetch.get('trends/icon-data');
          const { TREND_CATEGORY, TECHNOLOGIES } = response.data;
          setTrendCategory(Object.values(TREND_CATEGORY));
          setTechnologies(Object.values(TECHNOLOGIES));
        } catch (error) {
          console.error('Error fetching trend icon-data:', error);
        }
      }
    };
    fetchData();
  }, [isClosed]);
  const approveTrend = async (slug) => {
    try {
      setLoadingSlug(slug); // start loading
      await customFetch.patch(`trends/${slug}/approve`);
      // Handle successful approval (e.g., show a success message, refresh the list of trends, etc.)
      toast.success(<CustomSuccessToast message={'Trend Approved'} />);
    } catch (error) {
      // Handle error (e.g., show an error message)
      toast.error(error?.response?.data?.msg || 'Error approving trend');
    } finally {
      setLoadingSlug(null); // stop loading regardless of success or failure
    }
  };
  const removeTrend = async (slug) => {
    try {
      setLoadingSlug(slug); // start loading
      await customFetch.delete(`/trends/edit/${slug}`);
      // Handle successful approval (e.g., show a success message, refresh the list of trends, etc.)
      toast.success('Trend deleted successfully!');
    } catch (error) {
      // Handle error (e.g., show an error message)
      toast.error(error?.response?.data?.msg || 'Error deleting trend');
    } finally {
      setLoadingSlug(null); // stop loading regardless of success or failure
    }
  };
  const { trends, stats, charts, searchValues } = useLoaderData();
  const { user } = useOutletContext();
  const isAdminPage = user.role === 'admin';
  return (
    <Container>
      <StatComponent
        user={user.name}
        stats={[
          {
            title: 'Total Users',
            value: stats.users,
            icon: <FcApprove />,
            change: 1.01,
          },
          {
            title: 'Total Trends',
            value: stats.trends,
            icon: <FcLineChart />,
            change: -1.01,
          },
          {
            title: 'Total Approved Trends',
            value: stats.approved,
            icon: <FcCheckmark />,
            change: 1.01,
          },
          {
            title: 'Total Unapproved Trends',
            value: stats.unapproved,
            icon: <FcCancel />,
            change: 1.01,
          },
        ]}
      />
      {charts.monthTrends?.length > 1 && (
        <ChartAdminComponent data={charts} title="Stats:" />
      )}
      <CombinedProvider value={{ trends, searchValues }}>
        <FilterTrends
          isAdminPage={isAdminPage}
          trendCategory={trendCategory}
          technologies={technologies}
          isClosed={isClosed}
          setIsClosed={setIsClosed}
        />
        <Trends
          trends={trends}
          onDelete={removeTrend}
          onApprove={approveTrend}
          isAdminPage={isAdminPage}
          loadingSlug={loadingSlug}
        />
      </CombinedProvider>
    </Container>
  );
};

export default Admin;
