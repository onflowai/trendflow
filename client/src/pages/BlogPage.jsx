import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import CustomErrorToast from '../components/CustomErrorToast';
import React, { useState, useEffect } from 'react';
import {
  DangerousMarkdown,
  ScrollSpyComponent,
  TrendIconList,
} from '../components';
import Container from '../assets/wrappers/BlogPageContainer';
import { useDashboardContext } from '../pages/DashboardLayout.jsx';
import { redirect, useLoaderData } from 'react-router-dom';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { getFullIconUrl } from '../utils/urlHelper';
day.extend(advancedFormat);

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/blogs/${params.slug}`);
    console.log('data ', data);
    return { blogObject: data };
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
const getRandomColor = () => {
  const colors = ['#fbeebc', '#e976c7', '#4541de'];
  return colors[Math.floor(Math.random() * colors.length)];
};
const BlogPage = () => {
  const { blogObject } = useLoaderData();
  console.log('blogObject ', blogObject);
  const { title, content, author, updatedAt, trends } = blogObject;
  const upDate = day(updatedAt).format('MM YYYY');
  const isMobile = useWindowSize();
  const dashboardContext = useDashboardContext();
  const setSidebarVisibility = dashboardContext?.setSidebarVisibility;
  const [bgColor, setBgColor] = useState(getRandomColor());

  useEffect(() => {
    if (setSidebarVisibility) {
      setSidebarVisibility(!isMobile);
      return () => {
        setSidebarVisibility(false);
      };
    }
  }, [isMobile, setSidebarVisibility]);

  return (
    <Container>
      <div className="blog-page-container">
        <div className="page-layout">
          <div id="section1" className="blog">
            <div className="title-content-box">
              <h1 className="blog-title">{title}</h1>
              <div className="content-box" style={{ backgroundColor: bgColor }}>
                <div className="content">
                  <div className="author-info">
                    <img
                      src={author.profile_img}
                      alt={author.username}
                      className="author-img"
                    />
                    <span>{author.username}</span>
                  </div>
                  <div className="trend-icons">
                    {trends.map((trend, index) => (
                      <img
                        key={index}
                        src={getFullIconUrl(trend.techIconUrl)}
                        alt={trend.trend}
                        className="tech-icon"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="blog-date">{upDate}</div>
            <div id="section2" className="blog-content">
              <DangerousMarkdown content={content} />
            </div>
          </div>
          <aside className="scroll-spy-sidebar-aside">
            <div className="scroll-spy-sidebar">
              <ScrollSpyComponent sectionIds={['section1', 'section2']} />
              {!isMobile && (
                <div className="icon-trends">
                  <TrendIconList trends={trends} />
                </div>
              )}
            </div>
          </aside>
          {isMobile && (
            <div className="icon-trends">
              <TrendIconList trends={trends} />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default BlogPage;
