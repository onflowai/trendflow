import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import CustomErrorToast from '../components/CustomErrorToast';
import { useTheme } from '../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import {
  SEOProtected,
  TrendIconList,
  DangerousMarkdown,
  ScrollSpyComponent,
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
  const { isDarkTheme } = useTheme();
  const { slug } = useParams();
  const { blogObject } = useLoaderData();
  const { title, content, author, updatedAt, trends } = blogObject;
  const seen = new Set();
  const uniqueTrends = trends.filter((t) => {
    if (seen.has(t.trendTech)) return false;
    seen.add(t.trendTech);
    return true;
  }); //REMOVING TECH DUPLICATE IN TRENDS
  const upDate = day(updatedAt).format('MM YYYY');
  const { isMobile } = useWindowSize();
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
      <SEOProtected />
      <div className="blog-page-container">
        <div className="page-layout">
          <div id="blog" className="blog">
            <BlogTitle
              title={title}
              username={author.username}
              profileImg={author.profile_img}
              date={upDate}
              bgColor={bgColor}
            />
            <div className="trend-icons">
              {uniqueTrends.map((trend, index) => (
                <img
                  key={index}
                  src={getFullIconUrl(trend.techIconUrl)}
                  alt={trend.trend}
                  className="tech-icon"
                />
              ))}
            </div>
            <div className="blog-content">
              <DangerousMarkdown
                content={content}
                small={isMobile}
                isDarkTheme={isDarkTheme}
              />
            </div>
            {isMobile && (
              <div id="trends" className="icon-trends icon-trends--mobile">
                <TrendIconList trends={trends} />
              </div>
            )}
          </div>
          <aside className="scroll-spy-sidebar-aside">
          <div className="scroll-spy-sidebar">
            <ScrollSpyComponent sectionIds={['blog', 'trends']} />
            {/* DESKTOP: trends stay in the sticky sidebar */}
            {!isMobile && (
              <div id="trends" className="icon-trends">
                <TrendIconList trends={trends} />
              </div>
            )}
          </div>
        </aside>
        </div>
      </div>
    </Container>
  );
};

export default BlogPage;
