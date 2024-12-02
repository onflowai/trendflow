import React from 'react';
import { Link } from 'react-router-dom';
import day from 'dayjs';
import styled from 'styled-components';
import { getFullIconUrl } from '../utils/urlHelper';
import CarouselSlider from './CarouselSlider';
import DangerousMarkdown from './DangerousMarkdown';
import { truncateMarkdown } from '../utils/helpers';
import { RiEdit2Fill } from 'react-icons/ri';

function BlogPost({ title, content, slug, trends, author, user, updatedAt }) {
  const upDate = day(updatedAt).format('MM YYYY');
  const truncatedContent = truncateMarkdown(content, 300);
  const isAuthor = user?.role === 'admin' && user._id === author._id;

  return (
    <Container className="blog-item">
      <div className="content-wrapper">
        <div className="blog-details">
          <div className="title-container">
            {/* EDIT LINK */}
            {isAuthor && (
              <Link to={`/dashboard/edit-blog/${slug}`} className="edit-link">
                <RiEdit2Fill />
              </Link>
            )}
            {/* BLOG LINK */}
            <Link to={`/dashboard/blog/${slug}`} className="blog-link">
              <div className="blog-title">{title}</div>
            </Link>
          </div>
          <div className="blog-date">
            {upDate}
            {trends.map((trend, index) => (
              <img
                key={index}
                src={getFullIconUrl(trend.techIconUrl)}
                alt={trend.trend}
                className="tech-icon"
              />
            ))}
          </div>
          <div className="blog-content-short">
            <DangerousMarkdown content={truncatedContent} small />
          </div>
        </div>
        <div className="carousel">
          <CarouselSlider trends={trends} />
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .blog-item {
    padding: 20px;
    background-color: var(--white);
    border-bottom: 1.5px solid var(--gray-50);
    text-align: left;
    margin-bottom: 20px;
  }

  .content-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .blog-details {
    flex: 1;
  }

  .carousel {
    margin-left: 20px;
    margin-top: 20px;
  }

  .title-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .edit-link {
    color: var(--grey-700);
    font-size: 1.25rem;
    margin-right: 10px;
    display: flex;
    align-items: center;
  }

  .edit-link:hover {
    color: var(--primary-600);
  }

  .blog-link {
    text-decoration: none;
    color: var(--black);
    display: flex;
    flex-direction: column;
  }

  .blog-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--black);
  }

  .blog-title:hover {
    text-decoration: underline;
  }

  .blog-date {
    color: var(--grey-100);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }

  .tech-icon {
    margin-left: 0.5rem;
    width: 20px;
    height: 20px;
  }

  .blog-content-short {
    font-size: 1rem;
    color: var(--grey-700);
    margin-bottom: 3rem;
  }
`;

export default BlogPost;
