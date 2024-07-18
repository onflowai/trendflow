import React, { useState, useEffect, useRef } from 'react';
import { Form, useLoaderData, useNavigation } from 'react-router-dom';
import { ProfileHeader, CarouselCards, BlogPostList } from '../components';
import customFetch from '../utils/customFetch';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // importing UserContext
import { useDashboardContext } from './DashboardLayout';
import Container from '../assets/wrappers/BlogContainer';
import { toast } from 'react-toastify';
import { FcApprove, FcCheckmark, FcLineChart, FcCancel } from 'react-icons/fc';

/**
 * Blog.jsx displays the infoHub cards (lets user create and delete them) and displays the blog posts
 * @returns
 */
export const loader = async () => {};
export const action = async ({ request }) => {};

const Blog = () => {
  const { user } = useOutletContext();
  return (
    <Container>
      <ProfileHeader
        user={user}
        message="here is useful information about tech"
      />
      <CarouselCards />
      <div className="blog-content">
        <div className="user-form-container">
          <BlogPostList />
        </div>
      </div>
    </Container>
  );
};

export default Blog;
