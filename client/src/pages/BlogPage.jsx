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
import { redirect, useLoaderData, useParams } from 'react-router-dom';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { getFullIconUrl } from '../utils/urlHelper';
import BlogTitle from '../components/BlogTitle';
import useLocalStorage from '../hooks/useLocalStorage';
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
//isMobile only for Blog Page
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
  const colors = ['#f6f3e7', '#f9dbf0', '#dfdefc'];
  return colors[Math.floor(Math.random() * colors.length)];
};
const BlogPage = () => {
  const { slug } = useParams();
  const { blogObject } = useLoaderData();
  console.log('blogObject ', blogObject);
  const { title, content, author, updatedAt, trends } = blogObject;
  const upDate = day(updatedAt).format('MM YYYY');
  const isMobile = useWindowSize();
  const dashboardContext = useDashboardContext();
  const setSidebarVisibility = dashboardContext?.setSidebarVisibility;
  const [storedColor, setStoredColor] = useLocalStorage(
    `bgColor-${slug}`,
    null
  );
  const [bgColor, setBgColor] = useState(storedColor || getRandomColor());

  useEffect(() => {
    // Check if there is no stored color, then generate and store a new color
    if (!storedColor) {
      const newColor = getRandomColor(); // Generate a new random color
      setBgColor(newColor); // Set the new color in state
      setStoredColor(newColor); // Store the new color in local storage
    }
  }, [storedColor, setStoredColor, slug]);

  useEffect(() => {
    // Handle sidebar visibility based on window size
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
            <BlogTitle
              title={title}
              username={author.username}
              profileImg={author.profile_img}
              date={upDate}
              bgColor={bgColor}
            />
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
