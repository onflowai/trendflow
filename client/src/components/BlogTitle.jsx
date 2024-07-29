import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getFullIconUrl } from '../utils/urlHelper';
import { IoTime } from 'react-icons/io5'; // Import the IoTime icon
import { TitleHighlighter } from '../components';

const BlogTitle = ({ title, username, profileImg, icons, date, bgColor }) => {
  return (
    <Container bgColor={bgColor}>
      <div className="title-container">
        <div className="blog-title">
          <TitleHighlighter title={title} size="3em" />
        </div>
      </div>
      <div className="content-box">
        <div className="content">
          <div className="left-content">
            <div className="author-info">
              <img src={profileImg} alt={username} className="author-img" />
              <span>{username}</span>
            </div>
            <div className="trend-icons">
              {icons.map((icon, index) => (
                <img
                  key={index}
                  src={getFullIconUrl(icon)}
                  alt={`trend-${index}`}
                  className="tech-icon"
                />
              ))}
            </div>
          </div>
          <div className="right-content">
            <div className="date">
              <IoTime /> {date}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  position: relative;

  .title-container {
  display: block; 
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 0.5rem;
}

  .blog-title {
  margin-left: 0.7rem;
  font-size: 2rem;
  font-weight: bold;
  }

  .content-box {
    height: 15rem;
    background-color: ${({ bgColor }) => bgColor};
    border-radius: 15px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end; /* Align content to the bottom */
    position: relative;
  }

  .content {
    display: flex;
    flex-direction: row; /* Align content in a row */
    align-items: flex-end;
    justify-content: space-between; /* Space out the content */
    width: 100%;
  }

  .left-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end; /* Align left content to the bottom */
  }

  .right-content {
    display: flex;
    align-items: flex-end;
  }

  .author-info {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .author-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }

  .date {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: var(--white);
    margin-left: 1rem; /* Add some space between icons and date */
  }

  .trend-icons {
    display: flex;
    align-items: center;
  }

  .tech-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--white);
    margin-right: 0.5rem;
  }
`;

export default BlogTitle;
