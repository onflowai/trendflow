import React, { useState, useEffect } from 'react';
import {
  DangerousHTML,
  CustomErrorToast,
  FooterTrendDetails,
  ScrollSpyComponent,
  ContentRowComponent,
  ChartTrendComponent,
  ContentBoxHighlighted,
  RelatedTrendsDesktop,
  RelatedTrendsMobile,
} from '../components';
import { getFullIconUrl } from '../utils/urlHelper';
import { PiHashDuotone, PiEyeLight, PiTrendUp } from 'react-icons/pi';
import Container from '../assets/wrappers/TrendPageContainer';
import { useDashboardContext } from '../pages/DashboardLayout.jsx';
import { redirect, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import useWindowSize from '../hooks/useWindowSize';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
day.extend(advancedFormat);
/**
 * Trend Page will display detailed information about the trend
 * RelatedTrendsComponent needs to receive the current trends category to fetch related trends
 * @returns
 *
 */
//function to save a trend
const onSave = async (_id) => {
  try {
    const response = await customFetch.patch('/users/save-trend', { _id });
    if (response.status === 200) {
      toast.success('Trend saved successfully');
    } else {
      toast.error('Failed to save trend');
    }
  } catch (error) {
    toast.error('An error occurred while saving trend');
    console.error(error);
  }
};
//function to remove a saved trend
const onRemove = async (_id) => {
  try {
    const response = await customFetch.patch('/users/remove-trend', { _id });
    if (response.status === 200) {
      toast.success('Trend unmarked successfully');
    } else {
      toast.error('Failed to unmark trend');
    }
  } catch (error) {
    toast.error('An error occurred');
    console.error(error);
  }
};
//Fetching the trend data
export const loader = async ({ params }) => {
  try {
    const { data: trendData } = await customFetch.get(`/trends/${params.slug}`);
    const { data: savedTrendsData } = await customFetch.get(
      '/users/saved-trends'
    ); // fetching saved trends for the user
    const savedTrendIds =
      savedTrendsData?.savedTrends?.map((trend) => trend._id) || [];
    return { ...trendData, savedTrendIds };
  } catch (error) {
    console.error('Loader error:', error);
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return null;
  }
};
const TrendPage = () => {
  const { trendObject, relatedTrends, savedTrendIds } = useLoaderData(); //getting the trend from the loader above
  const [isSaved, setIsSaved] = useState(
    savedTrendIds.includes(trendObject._id)
  );
  const {
    trend,
    svg_url,
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
  const dashboardContext = useDashboardContext();
  const setSidebarVisibility = dashboardContext?.setSidebarVisibility; // Fallback

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    if (isSaved) {
      await onRemove(trendObject._id); // Remove the bookmark
      setIsSaved(false); // Update state
    } else {
      await onSave(trendObject._id); // Save the bookmark
      setIsSaved(true); // Update state
    }
  };

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
          src={getFullIconUrl(techIconUrl)}
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
        <img
          src={getFullIconUrl(cateIconUrl)}
          alt="Category Icon"
          style={{ width: '20px' }}
        />
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
          <div id="Trend" className="trend">
            <div>
              <ChartTrendComponent
                data={interestOverTime}
                forecast={forecast}
                trend={trend}
                trendLogo={svg_url}
              />
            </div>
            <h4 className="trend-title" id="Guide"></h4>
            <div className="trend-center">
              <div className="trend-items">
                <ContentRowComponent
                  items={items}
                  handleBookmarkClick={handleBookmarkClick}
                  isSaved={isSaved}
                />
              </div>
              <div className="trend-use-container">
                <ContentBoxHighlighted trendUse={trendUse} />
              </div>
            </div>
            <div className="trend-blog-post">
              <DangerousHTML html={generatedBlogPost} />
            </div>
            <FooterTrendDetails lastUpDate={upDate} createdBy={createdBy} />
          </div>
          <aside className="scroll-spy-sidebar-aside">
            <div className="scroll-spy-sidebar">
              <ScrollSpyComponent sectionIds={['Trend', 'Guide', 'Related']} />
              {!isMobile && (
                <div className="related-trend">
                  <RelatedTrendsDesktop
                    relatedTrends={relatedTrends}
                    onSave={onSave}
                    onRemove={onRemove}
                    savedTrends={savedTrendIds}
                  />
                </div>
              )}
            </div>
          </aside>
          <div className="" id="Related"></div>
          {isMobile && (
            <div className="related-trend">
              <RelatedTrendsMobile
                relatedTrends={relatedTrends}
                onSave={onSave}
                onRemove={onRemove}
                savedTrends={savedTrendIds}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default TrendPage;
