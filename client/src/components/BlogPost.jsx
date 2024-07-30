import React from 'react';
import { Link } from 'react-router-dom';
import day from 'dayjs';
import styled from 'styled-components';
import { getFullIconUrl, getFullTrendUrl } from '../utils/urlHelper';
import CarouselSlider from './CarouselSlider';
import DangerousMarkdown from './DangerousMarkdown';
import { truncateMarkdown } from '../utils/helpers';
import { RiEdit2Fill } from 'react-icons/ri';

/**
 * BlogPost returns each individual blog post
 * @returns
 */
function BlogPost({ title, content, slug, trends, author, user, updatedAt }) {
  const upDate = day(updatedAt).format('MM YYYY');
  const truncatedContent = truncateMarkdown(content, 300);
  return (
    <Container className="blog-item">
      <div className="content-wrapper">
        <div className="blog-details">
          <Link to={`/dashboard/blog/${slug}`} className="blog-link">
            <div className="title-container">
              <div className="edit-link">
                {user?.role === 'admin' && user._id === author._id && (
                  <Link to={`/dashboard/edit-blog/${slug}`} className="edit">
                    <RiEdit2Fill />
                  </Link>
                )}
              </div>
              <div className="blog-title">{title}</div>
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
              {/* small - tag for display  */}
              <DangerousMarkdown content={truncatedContent} small />
            </div>
          </Link>
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
    border-bottom: 1.5px solid var(--gray-50); /* Thin line between posts */
    text-align: left;
    margin-bottom: 20px; /* Add space between each blog post */
  }

  .content-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: flex-start; /* Align items at the top */
  }

  .blog-details {
    flex: 1;
  }

  .carousel {
    margin-left: 20px;
    margin-top: 20px; /* top margin to align with blog content */
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
  .edit{
    color: var(--primary2-600);
  }
  .edit:hover {
    color: var(--primary-600);
  }

  .blog-link {
    text-decoration: none;
    color: var(--black);
    display: flex;
    flex-direction: column;
  }

  .blog-title:hover {
    text-decoration: underline;
  }

  .blog-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: var(--black);
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
    margin-bottom: 10px;
    margin-bottom: 3rem;
  }
`;

export default BlogPost;
