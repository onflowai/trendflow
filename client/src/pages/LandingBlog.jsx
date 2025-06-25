import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import Container from '../assets/wrappers/BlogContainer';
import customFetch from '../utils/customFetch';
import axios from 'axios';
import {
  SEO,
  CarouselCards,
  BlogPostList,
  LandingNavbar,
  LandingFooter,
  StructuredData,
  CustomErrorToast,
  CustomSuccessToast,
} from '../components';

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

export const loader = async () => {
  const isSSR = typeof window === 'undefined';
  try {
    const [postsRes, infoRes] = await Promise.all(
      isSSR
        ? [
            axios.get(`${import.meta.env.VITE_DEV_API_BASE_URL}/blogs/public`),
            axios.get(
              `${import.meta.env.VITE_DEV_API_BASE_URL}/infohub/public`
            ),
          ]
        : [customFetch.get('/blogs/public'), customFetch.get('/infohub/public')]
    );

    return {
      posts: postsRes.data, // array
      infoHubItems: infoRes.data, // array
    };
  } catch (error) {
    toast.error('Failed to load blog posts or infoHub items');
    return { error: error.message };
  }
}; // loader fetches public blogs public info hub items

const LandingBlog = () => {
  const data = useLoaderData() || {};
  const posts = Array.isArray(data.posts) ? data.posts : [];
  const infoHubItems = Array.isArray(data.infoHubItems)
    ? data.infoHubItems
    : [];

  const authors = posts
    ? posts
        .map((post) => post.author)
        .filter(
          (author, idx, arr) =>
            author && arr.findIndex((a) => a._id === author._id) === idx
        )
    : []; // unique authors if you want a “Contributors” section

  const currentDate = new Date().toLocaleDateString();

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
      <SEO
        title="TrendFlow - Blog"
        description="Explore the latest tech news, and developer updates."
        url={`${FRONTEND_BASE_URL}/blog`}
        img_large={`${FRONTEND_BASE_URL}/og-image-blog.jpg`}
        img_small={`${FRONTEND_BASE_URL}/og-image-login-twitter.jpg`}
      />
      {data.error ? (
        <div>Error loading blogs: {data.error}</div>
      ) : (
        <LandingContainer>
          <StructuredData />
          <div className="container">
            <LandingNavbar />
          </div>
          <div className="carousel-section">
            <div className="carousel-container">
              <CarouselCards infoHubItems={infoHubItems} />
            </div>
          </div>
          <div className="blog-container">
            <div className="admin-section">
              <div className="contributors">Contributors:</div>
              <div className="author-list">
                {authors.map((author) => (
                  <img
                    key={author._id}
                    src={author.profile_img}
                    alt={author.username}
                    className="author-img"
                  />
                ))}
              </div>
              <div className="line" />
              <div className="current-date">{currentDate}</div>
            </div>
            <div className="blog-content">
              <BlogPostList
                posts={posts}
                isPublic={true}
                guestUser={guestUser}
              />
            </div>
          </div>
          <LandingFooter />
        </LandingContainer>
      )}
    </>
  );
};

export default LandingBlog;

const LandingContainer = styled(Container)`
  .container {

  }

  .carousel-section {
    margin-top: 5rem;
    margin: 2rem 0;
  }

  .contributors {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .author-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .author-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

`;
