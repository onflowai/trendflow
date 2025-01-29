import React, { useState } from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import Container from '../assets/wrappers/ErrorPageContainer';
import styled from 'styled-components';
import error01 from '../assets/images/error01.png';
import error02 from '../assets/images/error02.png';
import errorLogo from '../assets/images/trendflow-error.svg';
import { IoIosClose } from 'react-icons/io';
import { SEOProtected } from '../components';

/**
 * Error page component to display error messages based on the route error.
 * It displays different images on hover of the 'Go Back Home' link
 * and adjusts layout based on screen size.
 *
 * @returns {JSX.Element}
 */
const Error = () => {
  const error = useRouteError();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Determine which image to display based on hover state
  const displayedImage = isHovered ? error02 : error01;

  // Handle mouse enter on the link
  const handleMouseEnter = () => {
    setIsHovered(true);
    navigate('/dashboard');
  };

  // Handle mouse leave on the link
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Handle close button click
  const handleClose = () => {
    navigate('/dashboard');
  };

  // Render 404 Error Page
  if (error.status === 404) {
    return (
      <Container>
        <SEOProtected />
        <div className="content">
          {/* Top Bar with Logo and Close Button */}
          <div className="top-bar">
            <img src={errorLogo} alt="TrendFlow Logo" className="logo" />
            <div
              onClick={handleClose}
              aria-label="Close Error Page"
              className="close-button"
            >
              <IoIosClose size={24} />
            </div>
          </div>

          <div className="image-wrapper">
            <img src={displayedImage} alt="404 Error" className="error-emoji" />
          </div>
          <div className="text-wrapper">
            <h3>Something Went Wrong</h3>
            <p>The page you are looking for does not exist.</p>
            <button
              className="btn"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Go Back Home
            </button>
          </div>
        </div>
      </Container>
    );
  }

  // Render Generic Error Page
  return (
    <Container>
      <div className="content">
        <div className="top-bar">
          <img src={errorLogo} alt="TrendFlow Logo" className="logo" />
          <div
            onClick={handleClose}
            aria-label="Close Error Page"
            className="close-button"
          >
            <IoIosClose size={24} />
          </div>
        </div>

        <div className="text-wrapper">
          <h3>Something Went Wrong</h3>
          <p>An unexpected error has occurred. Please try again later.</p>
          <button
            className="btn"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Go Back Home
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Error;
