import React from 'react';
import styled from 'styled-components';
import { IoIosClose } from 'react-icons/io';
import LandingMenuLink from './LandingMenuLink';
import LandingNavbarSocials from './LandingNavbarSocials';
import { landingLinks, socialLinks } from '../assets/utils/data';
import DarkMode from './DarkMode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CustomErrorToast, CustomSuccessToast, Logo } from '.';
import { useDashboardContext } from '../pages/DashboardLayout';
import NavLinks from './NavLinks';

const SidebarOverlay = () => {
  const { showSidebar, toggleSidebar, user, logoutUser } =
    useDashboardContext() || {};
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success(<CustomSuccessToast message="Logged out successfully" />);
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
      {/* Overlay Container */}
      <div
        className={
          showSidebar ? 'sidebar-container show-sidebar' : 'sidebar-container'
        }
      >
        {/* Sidebar Content */}
        <div className="content">
          {/* Header Section */}
          <div className="header">
            <Logo />
            <DarkMode size={20} />
            <button
              type="button"
              className="close-btn"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <IoIosClose />
            </button>
          </div>

          {/* Overlay Content Section */}
          <div className="overlay-content">
            {/* NAVIGATION LINKS */}
            <div className="nav-links-wrapper">
              <NavLinks className="nav-links" isSidebar />
              <hr className="divider" />
              {user?.role === 'guestUser' && (
                <div className="create-account-link">
                  <LandingMenuLink
                    link={{
                      id: 'create-account',
                      href: '/register',
                      text: 'Create Account',
                    }}
                    onClick={toggleSidebar}
                    showDivider={false}
                  />
                  <hr className="divider" />
                </div>
              )}
            </div>

            {/* SOCIAL LINKS (uncomment if needed) */}
            {/* 
            <div className="social-links">
              <LandingNavbarSocials links={socialLinks} />
            </div> 
            */}

            {/* BUTTON */}
            <div className="button-container">
              {user?.role === 'guestUser' ? (
                <button className="btn leave-btn" onClick={handleLogout}>
                  Leave
                </button>
              ) : (
                <button className="btn" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.aside`
  @media (min-width: 992px) {
    display: none;
  }

  /* Sidebar Overlay */
  .sidebar-container {
    position: fixed;
    inset: 0; /* top: 0; right: 0; bottom: 0; left: 0 */
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 101;
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
  }
  .show-sidebar {
    opacity: 1;
    visibility: visible;
  }

  /* Sidebar Content Area */
  .content {
    background: var(--background-second-color);
    width: 100%;
    height: 100%;
    padding: 2rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Header Section */
  .header {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    margin-bottom: 2rem;
    position: relative;
  }

  /* Close Button */
  .close-btn {
    background: transparent;
    border: none;
    font-size: 2.5rem;
    color: var(--grey-600);
    cursor: pointer;
    transition: color 0.1s ease;
    justify-self: end;
  }
  .close-btn:hover {
    color: var(--primary-500);
  }

  /* Overlay Content (Main Body) */
  .overlay-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  /* Nav Links Container */
  .nav-links-wrapper {
    width: 80%;
    max-width: 400px;
    margin: 1rem 0;
    flex-direction: column;
    align-items: flex-start;
  }

  /* Example: "button-like" styling for nav links */
  .nav-links {
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    width: 100%; /* Ensure they take full available width */
  }

  .nav-link {
  color: var(--grey-600);
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem; /* space between links */
  text-align: left;
  text-transform: capitalize;
  background: var(--background-second-color);
  border: 1.5px solid var(--grey-70);
  border-radius: var(--input-radius-rounded);
  transition: var(--transition);
  cursor: pointer;
}

.nav-link:hover {
  background: var(--grey-100);
}

.nav-link:active,
.nav-link:focus {
  border: 1.5px solid var(--grey-300);
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

  /* Divider */
  .divider {
    width: 100%;
    border: none;
    border-top: 1.5px solid var(--grey-70);
    margin: 1rem 0;
  }

  /* Create Account Link */
  .create-account-link {
    width: 100%;
  }

  /* Social Links (if using LandingNavbarSocials) */
  .social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  /* Button Container */
  .button-container {
    width: 80%;
    max-width: 400px;
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }

  /* "Leave" Button Style */
  .leave-btn {
    background-color: var(--primary-200);
    color: var(--white);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.1s ease;
  }

  .leave-btn:hover {
    background-color: var(--yellow-light);
  }

  .leave-btn:focus {
    box-shadow: 0 0 0 2px var(--yellow-light);
  }
`;

export default SidebarOverlay;
