import React, { useEffect } from 'react';
import { FcElectricity, FcCalendar, FcApproval } from 'react-icons/fc';
import {
  CustomErrorToast,
  ScrollSpyComponent,
  ChartTrendComponent,
  RelatedTrendsComponent,
} from '../components';
import Container from '../assets/wrappers/TrendPageContainer';
import { useDashboardContext } from '../pages/DashboardLayout';
import {
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);
/**
 * Trend Page will display detailed information about the trend
 * @returns
 *
 */
//Fetching the trend data
export const loader = async ({ params }) => {
  console.log(params.slug);
  try {
    const { data } = await customFetch.get(`/trends/${params.slug}`);
    return data;
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return redirect('/dashboard');
  }
};
const TrendPage = () => {
  const { trendObject } = useLoaderData(); //getting the trend from the loader above
  const {
    trend,
    trendCategory,
    trendTech,
    updatedAt,
    generatedBlogPost,
    trendUse,
    interestOverTime,
  } = trendObject;
  const upDate = day(updatedAt).format('MM YYYY');
  console.log('OBJECT: ', trendObject);
  const { setSidebarVisibility } = useDashboardContext();
  useEffect(() => {
    setSidebarVisibility(true); // opens sidebar on initial component mount
    return () => {
      setSidebarVisibility(false); // reset on component unmount if desired
    };
  }, [setSidebarVisibility]); // ensure this only runs on mount and unmount
  return (
    <Container>
      <div className="trend">
        <ChartTrendComponent data={interestOverTime} />
        <h4 className="trend-title">{trend}</h4>
        <div className="trend-center">{trendCategory}</div>
        <span className="icon">
          <FcElectricity />
        </span>
        <span className="">{trendTech}</span>
        <span className="icon">
          <FcCalendar />
        </span>
        <span className="">{trendUse}</span>
        <span className="">{upDate}</span>
        <div className="">{generatedBlogPost}</div>
      </div>
      <aside className="scroll-spy-sidebar">
        <ScrollSpyComponent sectionIds={['section1', 'section2', 'section3']} />
        <RelatedTrendsComponent />
      </aside>
    </Container>
  );
};

export default TrendPage;
