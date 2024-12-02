import React, { useState, useRef, useEffect } from 'react';
import Container from '../assets/wrappers/UserDropdownContainer';
import useClickOutside from '../hooks/useClickOutside';
import { useDashboardContext } from '../pages/DashboardLayout';
import { UserImgSmall, Dropdown } from '../components';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
/**
 * Component responsible for the user dropdown functionality in the dashboard (only used in navbar)
 * @returns
 */
const UserDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logoutUser } = useDashboardContext() || {};
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const dropdownOptions = [
    { label: 'Logout User', action: 'logout' },
    { label: 'Add Account', action: 'addAccount' },
  ];

  const handleOptionClick = (action) => {
    if (action === 'logout') {
      logoutUser();
    } else if (action === 'addAccount') {
      navigate('/add-account');
    }
    setShowDropdown(false);
  };

  useClickOutside(dropdownRef, () => setShowDropdown(false));

  return (
    <Container ref={dropdownRef}>
      <button
        type="button"
        className="user-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <UserImgSmall user_img={user?.profile_img} />
        <div className="username">{user?.name}</div>
        {showDropdown ? (
          <IoIosArrowUp className="arrow-icon" />
        ) : (
          <IoIosArrowDown className="arrow-icon" />
        )}
      </button>
      {showDropdown && (
        <Dropdown
          options={dropdownOptions}
          onOptionClick={handleOptionClick}
          className="user-dropdown" // Optional: pass a className for styling
        />
      )}
    </Container>
  );
};

export default UserDropdown;
