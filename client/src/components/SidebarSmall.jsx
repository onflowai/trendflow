// src/components/SidebarSmall.js

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
import NavLinks from './NavLinks';
import { CustomErrorToast, CustomSuccessToast, Logo } from '../components';
import { useDashboardContext } from '../pages/DashboardLayout';

const SidebarSmall = () => {
  const { showSidebar, toggleSidebar, user, logoutUser } =
    useDashboardContext() || {};
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success(<CustomSuccessToast message={'Logged out successfully'} />);
      toggleSidebar(); // Close the sidebar
      navigate('/login'); // Redirect to login page
    } catch (error) {
      toast.error(
        <CustomErrorToast
          message={error?.response?.data?.msg || 'Logout failed'}
        />
      );
    }
  };

  return (
    <Container>
      <div
        className={
          showSidebar ? 'sidebar-container show-sidebar' : 'sidebar-container'
        }
      >
        <div className="content">
          <Header>
            <Logo />
            <DarkMode size={20} />
            <CloseButton
              type="button"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <IoIosClose />
            </CloseButton>
          </Header>
          <OverlayContent>
            {/* NAVIGATION LINKS */}
            <NavLinksWrapper>
              <NavLinks className="nav-links" isSidebar />
              <Divider />
              {user?.role === 'guestUser' && (
                <CreateAccountLink>
                  <LandingMenuLink
                    link={{
                      id: 'create-account',
                      href: '/register',
                      text: 'Create Account',
                    }}
                    onClick={toggleSidebar}
                    showDivider={false}
                  />
                  <Divider />
                </CreateAccountLink>
              )}
            </NavLinksWrapper>

            {/* SOCIAL LINKS */}

            {/* BUTTON */}
            <ButtonContainer>
              {user?.role === 'guestUser' ? (
                <LeaveButton className="btn" onClick={handleLogout}>
                  Leave
                </LeaveButton>
              ) : (
                <button className="btn" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </ButtonContainer>
          </OverlayContent>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.aside`
  @media (min-width: 992px) {
    display: none;
  }
  .sidebar-container {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 101;
    opacity: 0;
    transition: var(--transition);
    visibility: hidden;
  }
  .show-sidebar {
    z-index: 101;
    opacity: 1;
    visibility: visible;
  }
  .content {
    background: var(--background-second-color);
    width: 100%;
    height: 100%;
    padding: 2rem 2rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .close-btn {
    position: absolute;
    top: 10px;
    left: 10px;
    background: transparent;
    border-color: transparent;
    font-size: 2rem;
    color: var(--red-dark);
    cursor: pointer;
  }
  .nav-links {
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
  }
  .nav-link {
    display: flex;
    align-items: center;
    color: var(--text-second-color);
    padding: 1rem 0;
    text-transform: capitalize;
    transition: var(--transition);
    border: none;
  }
  .nav-link:hover {
    color: var(--primary-500);
  }
  .icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    display: grid;
    place-items: center;
  }
  
  .active {
    color: var(--primary-500);
  }
`;

const Header = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 2.5rem;
  color: var(--grey-600);
  cursor: pointer;
  transition: color 0.1s ease;
  justify-self: end;

  &:hover {
    color: var(--primary-500);
  }
`;

const OverlayContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const NavLinksWrapper = styled.div`
  width: 80%;
  max-width: 400px;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CreateAccountLink = styled.div`
  width: 100%;
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1.5px solid var(--grey-100);
  margin: 1rem 0;
`;
const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ButtonContainer = styled.div`
  width: 80%;
  max-width: 400px;
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;

// const LogoutButton = styled.button`
//   padding: 0.75rem 1.5rem;
//   background-color: var(--red-dark);
//   color: var(--white);
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 1rem;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: var(--red-light);
//   }

//   &:focus {
//     outline: none;
//     box-shadow: 0
//   }
// `;

const LeaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--red-dark);
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.1s ease;


  &:hover {
    background-color: var(--yellow-light);
  }

  &:focus {
    box-shadow: 0 0 0 2px var(--yellow-light);
  }
`;

export default SidebarSmall;
