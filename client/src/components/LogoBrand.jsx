import React from 'react';
import logo from '../assets/images/logo-02.svg';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigate('/dashboard');
    }
  };

  return (
    <Container
      className="logo-container"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex="0"
      role="button"
      aria-label="Navigate to Dashboard"
    >
      <img src={logo} alt="Tech Trend Flow Logo" className="logo" />
      <span className="logo-text">trendflow</span>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0.5rem; /* Added padding for better spacing */
  border-radius: 0.5rem; /* Rounded corners */
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;

  .logo-text {
    font-size: 0.8rem;
    font-weight: 700;
    margin-left: 0.5rem;
    background: var(--logo-text-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    /* Slight gradient */
    background-size: 200% 200%;
    background-position: left;
    transition: background 0.5s ease-in-out; /* Increased duration for smoother transition */
  }

  .logo {
    width: 28px; /* Reduced size */
    height: auto;
    transition: transform 0.3s ease-in-out;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .logo-text {
      font-size: 1rem;
      margin-left: 0.3rem; /* Changed from margin-right to margin-left for consistency */
    }

    .logo {
      width: 25px;
    }
  }

  @media (max-width: 480px) {
    .logo-text {
      font-size: 0.9rem;
      display: none; /* Hide text on very small screens if needed */
    }

    .logo {
      width: 20px;
    }
  }
`;

export default Logo;
