import React, { useState, useEffect, useRef } from 'react';
import { Form, useLoaderData, useNavigation } from 'react-router-dom';
import { ProfileHeader, CarouselCards, BlogPostList } from '../components';
import customFetch from '../utils/customFetch';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // importing UserContext
import { useDashboardContext } from './DashboardLayout';
import Container from '../assets/wrappers/BlogContainer';
import { toast } from 'react-toastify';

/**
 * Blog.jsx displays the infoHub cards (lets user create and delete them) and displays the blog posts
 * @returns
 */
export const loader = async () => {
  try {
    const [postsResponse, infoHubResponse] = await Promise.all([
      customFetch.get('/blogs'),
      customFetch.get('/infohub'),
    ]); // Fetch blog posts and infoHub cards concurrently

    const posts = postsResponse.data;
    const infoHubItems = infoHubResponse.data;

    return { posts, infoHubItems };
  } catch (error) {
    toast.error('Failed to load blog posts or infoHub items');
    return { error: error.message };
  }
};
export const action = async ({ request }) => {};

const Blog = () => {
  const { user } = useOutletContext();
  const { posts, infoHubItems, error } = useLoaderData();
  console.log('posts ', posts);
  console.log('infoHubItems ', infoHubItems);
  if (error) {
    return <div>Error loading blogs: {error}</div>;
  }

  return (
    <Container>
      <div className="carousel-section">
        <ProfileHeader
          user={user}
          message="Here is useful information about tech"
        />
        <div className="carousel-container">
          <CarouselCards infoHubItems={infoHubItems} />
        </div>
      </div>
      <div className="blog-container">
        <div className="blog-content">
          <BlogPostList posts={posts} />
        </div>
      </div>
    </Container>
  );
};

export default Blog;
