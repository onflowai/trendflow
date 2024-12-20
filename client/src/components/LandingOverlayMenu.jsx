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
    const data = {
      username: 'guest',
      name: 'user',
      email: 'user@trendflow.com',
      role: 'guestUser',
      password: 'dkflt!4FdsCds&',
      lastName: 'user',
    };
    try {
      await customFetch.post('/auth/login', data);
      await customFetch.post('/users/visits', { role: 'guestUser' });
      toast.success(<CustomSuccessToast message={'Welcome to trendFlow'} />);
      toggleOverlay(); // Close the overlay
      navigate('/dashboard');
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    }
  };

  const handleLoginClick = () => {
    toggleOverlay(); // close the overlay
    navigate('/login');
  };

  return (
    <OverlayContainer>
      <Header>
        <Logo />
        <DarkModeContainer>
          <DarkMode />
        </DarkModeContainer>
        <CloseButton
          type="button"
          onClick={toggleOverlay}
          aria-label="Close menu"
        >
          <IoIosClose />
        </CloseButton>
      </Header>
      <OverlayContent>
        {/* LINKS */}
        <NavLinks>
          {landingLinks.map((link, index) => (
            <LandingMenuLink
              key={link.id}
              link={link}
              onClick={toggleOverlay}
              showDivider={index < landingLinks.length - 1}
            />
          ))}
          <CallsDivider />
          <LandingMenuLink
            link={{
              id: 'start-using',
              href: '#start-using',
              text: 'start using',
            }}
            onClick={guestUser}
            showDivider={true}
          />
        </NavLinks>
        {/* SOCIAL LINKS */}
        <SocialLinks>
          {socialLinks.map((link) => (
            <LandingNavbarSocials
              {...link}
              key={link.id}
              itemClass="overlay-icon"
              onClick={toggleOverlay}
            />
          ))}
        </SocialLinks>
        <ButtonContainer>
          <LoginButton onClick={handleLoginClick}>Login</LoginButton>
        </ButtonContainer>
      </OverlayContent>
    </OverlayContainer>
  );
};

const OverlayContainer = styled.div`
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
`;

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const DarkModeContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const CloseButton = styled.button`
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
`;

const OverlayContent = styled.div`
  margin-top: 5rem; /* Adjust as needed */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const NavLinks = styled.div`
  width: 80%;
  max-width: 400px;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  list-style: none;
`;

const CallsDivider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid var(--grey-300);
  margin: 1rem 0;
`;

const DividerLine = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid var(--grey-300);
  margin: 0.5rem 0;
`;

const ButtonContainer = styled.div`
  width: 80%;
  max-width: 400px;
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const LoginButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-500);
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--primary-600);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--primary-300);
  }
`;

export default LandingOverlayMenu;
