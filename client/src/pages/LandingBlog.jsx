import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import Container from '../assets/wrappers/BlogContainer';
import customFetch from '../utils/customFetch';
import {
  SEO,
  CarouselCards,
  BlogPostList,
  LandingNavbar,
  LandingFooter,
  StructuredData,
} from '../components';

const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL;

export const loader = async () => {
  try {
    const [postsResponse, infoHubResponse] = await Promise.all([
      customFetch.get('/blogs/public'),
      customFetch.get('/infohub/public'),
    ]);

    const posts = postsResponse.data;
    const infoHubItems = infoHubResponse.data;
    return { posts, infoHubItems };
  } catch (error) {
    toast.error('Failed to load blog posts or infoHub items');
    return { error: error.message };
  }
}; // loader fetches public blogs + public info hub items

const LandingBlog = () => {
  const { posts, infoHubItems, error } = useLoaderData();

  if (error) {
    return <div>Error loading blogs: {error}</div>;
  }

  const authors = posts
    ? posts
        .map((post) => post.author)
        .filter(
          (author, idx, arr) =>
            author && arr.findIndex((a) => a._id === author._id) === idx
        )
    : []; // unique authors if you want a “Contributors” section

  const currentDate = new Date().toLocaleDateString();

  return (
    <LandingContainer>
      <SEO
        title="TrendFlow - Blog"
        description="Explore the latest tech news, and developer updates."
        url={`${FRONTEND_BASE_URL}/blog`}
        img_large={`${FRONTEND_BASE_URL}/og-image-blog.jpg`}
        img_small={`${FRONTEND_BASE_URL}/og-image-login-twitter.jpg`}
      />
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
          <BlogPostList posts={posts} isPublic={true} />
        </div>
      </div>
      <LandingFooter />
    </LandingContainer>
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
