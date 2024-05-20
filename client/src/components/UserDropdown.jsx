import React, { useState } from 'react';
import Container from '../assets/wrappers/UserDropdownContainer';
import { useDashboardContext } from '../pages/DashboardLayout';
import { UserImgSmall } from '../components';
/**
 * Component responsible for the user dropdown functionality in the dashboard (only used in navbar)
 * @returns
 */
const UserDropdown = () => {
  const [showDropdown, setDropdown] = useState(false);
  const { user, logoutUser } = useDashboardContext() || {};
  return (
    <Container>
      <button
        type="button"
        className="user-btn"
        onClick={() => setDropdown(!showDropdown)}
      >
        <UserImgSmall user_img={user.profile_img} />
        {/* {user?.name} */}
      </button>
      <div className={showDropdown ? 'dropdown show-dropdown' : 'dropdown'}>
        <button type="button" className="dropdown-btn" onClick={logoutUser}>
          logout user
        </button>
        <button type="button" className="dropdown-btn">
          Add Account
        </button>
      </div>
    </Container>
  );
};

export default UserDropdown;
