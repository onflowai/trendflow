import React, { useState, useEffect } from 'react';
import { useLoaderData, useParams, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import customFetch from '../utils/customFetch';
import Container from '../assets/wrappers/BlogPageContainer';
import {
  SEO,
  LandingFooter,
  LandingNavbar,
  TrendIconList,
  StructuredData,
  DangerousMarkdown,
  ScrollSpyComponent,
} from '../components';
import BlogTitle from '../components/BlogTitle';

import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { getFullIconUrl } from '../utils/urlHelper';
import useLocalStorage from '../hooks/useLocalStorage';

day.extend(advancedFormat);
const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL;

export const loader = async ({ params }) => {
  const { slug } = params;
  try {
    const { data } = await customFetch.get(`/blogs/public/${slug}`);
    // data is your single public blog post
    return { blogObject: data };
  } catch (error) {
    // If no post found or error, handle it
    toast.error(error?.response?.data?.message || 'Cannot load public blog');
    // redirect to a public route or home if you want
    return redirect('/');
  }
};

const LandingBlogPage = () => {
  const { slug } = useParams();
  const { blogObject } = useLoaderData();
  const { title, content, author, updatedAt, trends } = blogObject; // destructuring your blog fields
  const formattedDate = day(updatedAt).format('MMMM YYYY'); // formatting date using day.js
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 992);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // hook to check if window is mobile (replicates your code)

  const getRandomColor = () => {
    const colors = ['#f6f3e7', '#f9dbf0', '#dfdefc'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const [storedColor, setStoredColor] = useLocalStorage(
    `bgColor-${slug}`,
    null
  );
  const [bgColor, setBgColor] = useState(storedColor || getRandomColor());

  useEffect(() => {
    if (!storedColor) {
      const newColor = getRandomColor();
      setBgColor(newColor);
      setStoredColor(newColor);
    }
  }, [storedColor, setStoredColor, slug]);
  return (
    <LandingContainer>
      <SEO
        title={title || 'trendflow blog'}
        description={`trendflow blog: ${title}`}
        url={`${FRONTEND_BASE_URL}/${title}`}
        img_large={`${FRONTEND_BASE_URL}/og-image-blog-page.jpg`}
        img_small={`${FRONTEND_BASE_URL}/og-image-blog-page-twitter.jpg`}
      />
      <StructuredData />
      <div className="container">
        <LandingNavbar />
      </div>
      <div className="blog-page-container">
        <div className="page-layout">
          <div id="blog" className="blog">
            <BlogTitle
              title={title}
              username={author?.username || 'Unknown'}
              profileImg={author?.profile_img}
              date={formattedDate}
              bgColor={bgColor}
            />
            <div className="trend-icons">
              {trends.map((trend, idx) => (
                <img
                  key={idx}
                  src={getFullIconUrl(trend.techIconUrl)}
                  alt={trend.trend}
                  className="tech-icon"
                />
              ))}
            </div>
            <div className="blog-content">
              <DangerousMarkdown content={content} small={isMobile} />
            </div>
          </div>
          <aside className="scroll-spy-sidebar-aside">
            <div className="scroll-spy-sidebar">
              <ScrollSpyComponent sectionIds={['blog', 'trends']} />
              {!isMobile && (
                <div className="icon-trends">
                  <TrendIconList trends={trends} />
                </div>
              )}
            </div>
          </aside>
          {isMobile && (
            <div id="trends" className="icon-trends">
              <TrendIconList trends={trends} />
            </div>
          )}
        </div>
      </div>
      <LandingFooter />
    </LandingContainer>
  );
};
export default LandingBlogPage;

const LandingContainer = styled(Container)`
  padding-top: 5rem;
`;
