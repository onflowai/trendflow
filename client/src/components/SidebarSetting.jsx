import React from 'react';
import { useDashboardContext } from '../pages/DashboardLayout';
import styled from 'styled-components';
import { IoSettingsSharp } from 'react-icons/io5'; // Assuming you're using FontAwesome for icons
import { Link } from 'react-router-dom';
import { HiUser } from 'react-icons/hi2';

const SidebarSetting = () => {
  const { user } = useDashboardContext() || {};
  return (
    <Container>
      <div className="sidebar-setting">
        <Link to="/dashboard/profile" className="user-container">
          <div className="user-pic-wrapper">
            {user.profile_img ? (
              <img src={user?.profile_img} alt="User" className="user-pic" />
            ) : (
              <HiUser size={25} className="icon" class="user-default-pic" />
            )}
          </div>
          <span className="user-name">{user?.username}</span>
        </Link>
        <IoSettingsSharp
          className="settings-icon"
          onClick={() => (window.location.href = '/dashboard/settings')}
        />
      </div>
    </Container>
  );
};

export default SidebarSetting;

const Container = styled.div`
  .sidebar-setting {
    background: var(--background-second-color);
    border-radius: 10px;
    padding: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem; // Adjust as needed
  }
  .user-container {
    display: flex;
    align-items: center;
    text-decoration: none; // Remove underline from link
  }
  .user-pic-wrapper {
    position: relative;
    width: 35px; // Adjust size as needed
    height: 35px; // Adjust size as needed
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--primary-100);
  }
  .user-pic {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: opacity 0.3s ease;
  }
  .user-pic-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.4); // Light color overlay
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .user-pic-wrapper:hover::before {
    opacity: 1;
  }
  .user-default-pic {
    font-size: 30px; // Adjust icon size
    color: var(--primary-500); // Set icon color
  }
  .user-name {
    font-size: 1rem; // Adjust as needed
    color: var(--black); // Set username color to black
    margin-left: 0.6rem; // Space between image and name
    transition: color 0.3s ease;
  }
  .user-name:hover {
    color: var(--grey-500); // Change color on hover
  }
  .settings-icon {
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-primary-color);
    transition: color 0.3s ease;
  }
  .settings-icon:hover {
    color: var(--primary-500); // Highlight color
  }
`;
