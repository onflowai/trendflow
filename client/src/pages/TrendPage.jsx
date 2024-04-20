import React, { useState, useEffect } from 'react';
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
function useWindowSize() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 992);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return isMobile;
}
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
  const isMobile = useWindowSize();
  const upDate = day(updatedAt).format('MM YYYY');
  console.log('OBJECT: ', trendObject);
  const { setSidebarVisibility } = useDashboardContext();
  useEffect(() => {
    setSidebarVisibility(!isMobile); // opens sidebar on initial component mount
    return () => {
      setSidebarVisibility(false); // reset on component unmount if desired
    };
  }, [isMobile, setSidebarVisibility]); // ensure this only runs on mount and unmount
  return (
    <Container>
      <div className="page-layout">
        <div className="trend">
          <div id="section1">
            <ChartTrendComponent data={interestOverTime} />
          </div>
          <h4 className="trend-title" id="section2">
            {trend}
          </h4>
          <div className="trend-center">
            <div className="trend-category">{trendCategory}</div>
            <div className="trend-tech">{trendTech}</div>
            <div className="">{trendUse}</div>
            <div className="">{upDate}</div>
            <div className="" id="section3">
              {generatedBlogPost}
            </div>
          </div>
        </div>
        <aside className="scroll-spy-sidebar-aside">
          <div className="scroll-spy-sidebar">
            <ScrollSpyComponent
              sectionIds={['section1', 'section2', 'section3']}
            />
            {!isMobile && (
              <div className="related-trend">
                <RelatedTrendsComponent />
              </div>
            )}
          </div>
        </aside>
        {isMobile && (
          <div className="related-trend">
            <RelatedTrendsComponent />
          </div>
        )}
      </div>
    </Container>
  );
};

export default TrendPage;
