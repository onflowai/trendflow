import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Container from '../assets/wrappers/UserDropdown';
import { useDashboardContext } from '../pages/DashboardLayout';
/**
 * Component responsible for the user dropdown fucntionality in the dashboard
 * @returns
 */
const UserDropdown = () => {
  const [showDropdown, setDropdown] = useState(false);
  const { user, logoutUser } = useDashboardContext();
  return (
    <Container>
      <button
        type="button"
        className="user-btn"
        onClick={() => setDropdown(!showDropdown)}
      >
        <FaUserCircle className="user" />
        {/* {user?.name} */}
      </button>
      <div className={showDropdown ? 'dropdown show-dropdown' : 'dropdown'}>
        <button type="button" className="dropdown-btn" onClick={logoutUser}>
          logout user
        </button>
        <button type="button" className="dropdown-btn">
          Add acount
        </button>
      </div>
    </Container>
  );
};

export default UserDropdown;
