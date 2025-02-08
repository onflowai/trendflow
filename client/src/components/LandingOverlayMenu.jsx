import React from 'react';
import styled from 'styled-components';
import { IoIosClose } from 'react-icons/io';
import LandingMenuLink from './LandingMenuLink';
import LandingNavbarSocials from './LandingNavbarSocials';
import { landingLinks, socialLinks } from '../assets/utils/data';
import DarkMode from './DarkMode';
import { useNavigate } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { CustomErrorToast, CustomSuccessToast, Logo } from '../components';

const LandingOverlayMenu = ({ toggleOverlay }) => {
  const navigate = useNavigate();

  const guestUser = async () => {
    try {
      await customFetch.post('/auth/guest-login'); // calling guest login endpoint
      toast.success(
        <CustomSuccessToast message={'Welcome to trendFlow as Guest'} />
      );
      return navigate('/dashboard');
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    }
  }; //guestUser signs in using guestLogin controller

  const handleLoginClick = () => {
    toggleOverlay(); // close the overlay
    navigate('/login');
  };

  return (
    <Container>
      <div className="header">
        <Logo />
        <div className="dark-mode-container">
          <DarkMode size={20} />
        </div>
        <button
          type="button"
          onClick={toggleOverlay}
          aria-label="Close menu"
          className="close-btn"
        >
          <IoIosClose />
        </button>
      </div>
      <div className="overlay-content">
        {/* LINKS */}
        <div className="overlay-nav-links">
          {landingLinks.map((link, index) => (
            <LandingMenuLink
              key={link.id}
              link={link}
              onClick={toggleOverlay}
              showDivider={index < landingLinks.length - 1}
            />
          ))}
          <hr className="calls-divider" />
          <LandingMenuLink
            link={{
              id: 'start-using',
              href: '#start-using',
              text: 'start using',
            }}
            onClick={guestUser}
            showDivider={true}
          />
        </div>
        {/* SOCIAL LINKS */}
        <div className="social-links">
          {socialLinks.map((link) => (
            <LandingNavbarSocials
              {...link}
              key={link.id}
              itemClass="nav-icon overlay-icon"
              onClick={toggleOverlay}
            />
          ))}
        </div>

        <div className="button-container">
          <button onClick={handleLoginClick} className="login-button">
            Login
          </button>
        </div>
      </div>
    </Container>
  );
};

export default LandingOverlayMenu;

const Container = styled.div`
  @media (min-width: 992px) {
    display: none;
  }
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--background-color);
  z-index: 999;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease-in-out;
  padding: 1rem;

  .header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .dark-mode-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .close-btn {
    background: transparent;
    border: none;
    font-size: 2rem;
    color: var(--grey-600);
    cursor: pointer;
    transition: color 0.3s ease;
    display: flex;
    align-items: center;

    &:hover {
      color: var(--primary-500);
    }
  }

  .overlay-content {
    margin-top: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .overlay-nav-links {
    width: 80%;
    max-width: 400px;
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .social-links {
    display: flex;
    gap: 1.3rem;
    margin-top: 1rem;
    list-style: none;
    font-size: 1.3rem;
  }
  .social-links .overlay-icon i {
    color: var(--primary-600);
    transition: color 0.3s;
  }

  .social-links .overlay-icon i:hover {
    color: var(--primary-600);
  }

  .calls-divider {
    width: 100%;
    border: none;
    border-top: 1.5px solid var(--grey-50);
    margin: 0.5rem 0;
  }

  .button-container {
    width: 80%;
    max-width: 400px;
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }

  .login-button {
    cursor: pointer;
    color: var(--btn-text-color);
    background: var(--grey-50);
    border: 1.5px solid var(--grey-70);
    border-radius: var(--input-radius-rounded);
    letter-spacing: var(--letter-spacing);
    padding: 0.7rem 0.9rem;
    transition: var(--transition);
    text-transform: capitalize;
    display: inline-block;

    &:hover {
      background-color: var(--primary2-500);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--primary-300);
    }
  }
`;
