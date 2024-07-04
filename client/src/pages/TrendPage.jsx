import React, { useState, useEffect } from 'react';
import {
  DangerousHTML,
  CustomErrorToast,
  FooterTrendDetails,
  ScrollSpyComponent,
  ContentRowComponent,
  ChartTrendComponent,
  ContentBoxHighlighted,
  RelatedTrendsComponent,
} from '../components';
import { PiHashDuotone, PiEyeLight, PiTrendUp } from 'react-icons/pi';
import Container from '../assets/wrappers/TrendPageContainer';
import { useDashboardContext } from '../pages/DashboardLayout.jsx';
import { redirect, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);
/**
 * Trend Page will display detailed information about the trend
 * RelatedTrendsComponent needs to receive the current trends category to fetch related trends
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
    views,
    forecast,
    trendStatus,
    techIconUrl,
    cateIconUrl,
    createdBy,
  } = trendObject;
  const isMobile = useWindowSize();
  const upDate = day(updatedAt).format('MM YYYY');
  console.log('USER: ', createdBy);
  console.log('OBJECT: ', trendObject);
  console.log('TREND USE: ', trendUse);
  console.log('TREND BLOG: ', generatedBlogPost);
  console.log('FORECAST IN TREND PAGE: ', forecast);
  const dashboardContext = useDashboardContext();
  const setSidebarVisibility = dashboardContext?.setSidebarVisibility; // Fallback

  useEffect(() => {
    if (setSidebarVisibility) {
      setSidebarVisibility(!isMobile); // opens sidebar on initial component mount
      return () => {
        setSidebarVisibility(false); // reset on component unmount if desired
      };
    }
  }, [isMobile, setSidebarVisibility]); // ensure this only runs on mount and unmount
  var boys = undefined;
  //list of items used in the row under the chart takes on label, icon, and link and styling
  const items = [
    {
      label: trendTech,
      icon: techIconUrl ? (
        <img
          src={techIconUrl}
          alt="Technology Icon"
          style={{ width: '20px' }}
        />
      ) : (
        <PiHashDuotone />
      ),
      link: '/dashboard',
      styled: true,
    },
    {
      label: trendCategory,
      icon: cateIconUrl ? (
        <img src={cateIconUrl} alt="Category Icon" style={{ width: '20px' }} />
      ) : (
        <PiHashDuotone />
      ),
      link: '/dashboard',
      styled: true,
    },
    { label: trendStatus, icon: <PiTrendUp />, styled: true },
    { label: views, icon: <PiEyeLight />, styled: false },
  ];
  return (
    <Container>
      <div className="trend-page-container">
        <div className="page-layout">
          <div id="section1" className="trend">
            <div>
              <ChartTrendComponent
                data={interestOverTime}
                forecast={forecast}
                trend={trend}
              />
            </div>
            <h4 className="trend-title" id="section2"></h4>
            <div className="trend-center">
              <div className="trend-items">
                <ContentRowComponent items={items} />
              </div>
              <div className="trend-use-container">
                <ContentBoxHighlighted trendUse={trendUse} />
              </div>
            </div>
            <div className="" id="section3"></div>
            <div className="trend-blog-post">
              <DangerousHTML html={generatedBlogPost} />
            </div>
            <FooterTrendDetails lastUpDate={upDate} createdBy={createdBy} />
          </div>
          <aside className="scroll-spy-sidebar-aside">
            <div className="scroll-spy-sidebar">
              <ScrollSpyComponent
                sectionIds={['section1', 'section2', 'section3']}
              />
              {!isMobile && (
                <div className="related-trend">
                  <RelatedTrendsComponent
                    lastUpDate={upDate}
                    // createdBy={createdBy}
                  />
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
      </div>
    </Container>
  );
};

export default TrendPage;
