import React, { useState, useEffect } from 'react';
import {
  useLoaderData,
  useNavigation,
  useParams,
  redirect,
} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
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
  CustomErrorToast,
  DangerousMarkdown,
  CustomSuccessToast,
  ScrollSpyComponent,
} from '../components';
import BlogTitle from '../components/BlogTitle';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { getFullIconUrl } from '../utils/urlHelper';
import useLocalStorage from '../hooks/useLocalStorage';

day.extend(advancedFormat);
const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL;

const getCsrfToken = async () => {
  try {
    const response = await customFetch.get('/csrf-token');
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

export const loader = async ({ params }) => {
  const slug = params?.slug;
  const isSSR = typeof window === 'undefined';
  console.log('SSR Blog loader params:', params, 'window:', typeof window);
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
      : '/api/v1';

    const fetchUrl = isSSR
      ? `${apiBaseUrl}/blogs/public/${slug}`
      : `/blogs/public/${slug}`;

    console.log(`[SSR Loader Fetching URL]: ${fetchUrl}`);
    const { data } = await (isSSR ? axios : customFetch).get(fetchUrl);
    return { blogObject: data, error: null };
  } catch (error) {
    console.error('[Axios SSR Error FULL DETAILS]', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });

    const message =
      error?.response?.data?.message ||
      error.message ||
      'Cannot load public blog';
    console.error('[Loader Fetch Error]', message);
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
  const { isDarkTheme } = useTheme();
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

  const isSSR = typeof window === 'undefined';
  const {
    title,
    content,
    author,
    updatedAt,
    trends: rawTrends,
  } = blogObject || {};
  const trends = Array.isArray(rawTrends) ? rawTrends : [];
  const seen = new Set();
  const uniqueTrends = trends.filter((t) => {
    if (seen.has(t.trendTech)) return false;
    seen.add(t.trendTech);
    return true;
  }); //REMOVING TECH DUPLICATE IN TRENDS
  const formattedDate = day(updatedAt).format('MMMM YYYY');

  const guestUser = async () => {
    try {
      const csrfToken = await getCsrfToken(); // fetch CSRF token as in the login page
      await customFetch.post(
        '/auth/guest-login',
        {},
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        }
      );
      toast.success(
        <CustomSuccessToast message={'Welcome to trendFlow as Guest'} />
      );
      return true; //for CarouselSlider
      //return navigate('/dashboard');
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    }
  }; //guestUser signs in using guestLogin controller

  return (
    <>
      {title && (
        <SEO
          title={title}
          description={`trendflow blog: ${title}`}
          url={`${FRONTEND_BASE_URL}/blog/${slug}`}
          img_large={`${FRONTEND_BASE_URL}/og-image-blog-page.jpg`}
          img_small={`${FRONTEND_BASE_URL}/og-image-blog-page-twitter.jpg`}
        />
      )}
      {isLoading || (!isSSR && !clientReady) ? (
        <LandingContainer>
          <div className="container">
            <LandingNavbar />
            <h2 style={{ padding: '2rem' }}>Loading blog...</h2>
          </div>
          <LandingFooter />
        </LandingContainer>
      ) : error || !blogObject ? (
        <LandingContainer>
          <div className="container">
            <LandingNavbar />
            <h2 style={{ padding: '2rem' }}>{error || 'Blog not found'}</h2>
          </div>
          <LandingFooter />
        </LandingContainer>
      ) : (
        //BLOG:
        <LandingContainer>
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
                  {uniqueTrends.map((trend, idx) => (
                    <img
                      key={idx}
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
              </div>
              <aside className="scroll-spy-sidebar-aside">
                <div className="scroll-spy-sidebar">
                  <ScrollSpyComponent sectionIds={['blog', 'trends']} />
                  {!isMobile && (
                    <div className="icon-trends">
                      <TrendIconList trends={trends} guestUser={guestUser} />
                    </div>
                  )}
                </div>
              </aside>
              {isMobile && (
                <div id="trends" className="icon-trends">
                  <TrendIconList trends={trends} guestUser={guestUser} />
                </div>
              )}
            </div>
          </div>
          <LandingFooter />
        </LandingContainer>
      )}
    </>
  );
};
export default LandingBlogPage;

const LandingContainer = styled(Container)`
  padding-top: 5rem;
`;
