import React, { useState, useEffect } from 'react';
import {
  useLoaderData,
  useNavigation,
  useParams,
  redirect,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import useWindowSize from '../hooks/useWindowSize';
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
  const slug = params?.slug;
  const isSSR = typeof window === 'undefined';

  if (!slug) {
    const message = 'No slug provided for blog page';
    if (isSSR) {
      console.error('SSR Blog loader error:', message);
      return { blogObject: null, error: message };
    } else {
      toast.error(message);
      return redirect('/');
    }
  }

  try {
    const apiBaseUrl = isSSR
      ? import.meta.env.VITE_DEV_API_BASE_URL || 'http://localhost:5000/api'
      : '';
    const { data } = await customFetch.get(
      `${apiBaseUrl}/blogs/public/${slug}`
    );
    return { blogObject: data, error: null };
  } catch (error) {
    const message = error?.response?.data?.message || 'Cannot load public blog';
    if (isSSR) {
      console.error('SSR Blog loader error:', message);
      return { blogObject: null, error: message };
    } else {
      toast.error(message);
      return redirect('/');
    }
  }
};

const LandingBlogPage = () => {
  const { slug } = useParams();
  const data = useLoaderData() || {};
  const { blogObject, error } = data;
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  // Fallback flag for client hydration
  const [clientReady, setClientReady] = useState(false);
  useEffect(() => {
    setClientReady(true);
  }, []);

  const { isMobile } = useWindowSize();
  const [storedColor, setStoredColor] = useLocalStorage(
    `bgColor-${slug}`,
    null
  );
  const getRandomColor = () => {
    const colors = ['#f6f3e7', '#f9dbf0', '#dfdefc'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const [bgColor, setBgColor] = useState(storedColor || getRandomColor());
  useEffect(() => {
    if (!storedColor) {
      const newColor = getRandomColor();
      setBgColor(newColor);
      setStoredColor(newColor);
    }
  }, [storedColor, setStoredColor, slug]);

  if (isLoading || !clientReady) {
    return (
      <LandingContainer>
        <div className="container">
          <LandingNavbar />
          <h2 style={{ padding: '2rem' }}>Loading blog...</h2>
        </div>
        <LandingFooter />
      </LandingContainer>
    );
  }

  if (error || !blogObject) {
    return (
      <LandingContainer>
        <div className="container">
          <LandingNavbar />
          <h2 style={{ padding: '2rem' }}>{error || 'Blog not found'}</h2>
        </div>
        <LandingFooter />
      </LandingContainer>
    );
  }

  const { title, content, author, updatedAt, trends: rawTrends } = blogObject;
  console.log('title', title);
  const trends = Array.isArray(rawTrends) ? rawTrends : [];
  const formattedDate = day(updatedAt).format('MMMM YYYY');

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
