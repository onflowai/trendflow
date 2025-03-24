import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import Container from '../assets/wrappers/BlogContainer';
import customFetch from '../utils/customFetch';
import { CarouselCards, BlogPostList } from '../components';

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
};

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
    : [];

  return (
    <Container>
      <div className="carousel-section">
        <CarouselCards infoHubItems={infoHubItems} />
      </div>

      <div className="blog-container">
        {authors.length > 0 && (
          <div className="contributors">
            <h3>Contributors</h3>
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
          </div>
        )}

        <BlogPostList posts={posts} />
      </div>
    </Container>
  );
};

export default LandingBlog;

const LandingContainer = styled(Container)`
  .carousel-section {
    margin-bottom: 2rem;
  }

  .contributors {
    margin-bottom: 1rem;
  }

  .author-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .author-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
