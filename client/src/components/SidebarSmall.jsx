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
  console.log('user: ', user);

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
            <DarkModeContainer>
              <DarkMode />
            </DarkModeContainer>
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
              <NavLinks isSidebar={true} />
              <Divider />
              <LandingMenuLink
                link={{
                  id: 'start-using',
                  href: '#start-using',
                  text: 'start using',
                }}
                onClick={toggleSidebar} // Assuming 'start using' navigates within the app
                showDivider={true}
              />
            </NavLinksWrapper>

            {/* SOCIAL LINKS */}
            <SocialLinks>
              {socialLinks.map((link) => (
                <LandingNavbarSocials
                  {...link}
                  key={link.id}
                  itemClass="overlay-icon"
                  onClick={toggleSidebar}
                />
              ))}
            </SocialLinks>

            {/* LOGOUT BUTTON */}
            <ButtonContainer>
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
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
`;

const Header = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  margin-top: 5rem;
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

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  list-style: none;
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid var(--grey-300);
  margin: 1rem 0;
`;

const ButtonContainer = styled.div`
  width: 80%;
  max-width: 400px;
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const LogoutButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--red-dark);
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--red-light);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--red-light);
  }
`;

export default SidebarSmall;
