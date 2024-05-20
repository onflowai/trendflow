import React, { useState, useRef, useEffect } from 'react';
import Container from '../assets/wrappers/UserSettingsContainer';
import { FormComponentButton, ToggleSwitch, Dropdown } from '../components';
import { CiSettings } from 'react-icons/ci';
/**
 *
 * @param {*} param0
 * @returns
 */
const UserSettings = ({
  email,
  isVerified,
  onUpdateEmail,
  onTogglePrivacy,
  onOptionClick,
}) => {
  const handleUpdateEmail = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target.closest('form'));
    onUpdateEmail({ request: { formData } });
  };
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
  };
  const handleToggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const dropdownOptions = [
    { label: 'Verify Profile', action: 'verify' },
    { label: 'Delete Profile', action: 'delete' },
  ];
  return (
    <Container>
      <h6 className="header">Settings:</h6>
      <div className="email-section">
        <FormComponentButton
          type="email"
          name="email"
          defaultValue={email}
          buttonText="Update"
          onClick={handleUpdateEmail}
        />
      </div>
      <div className="settings-section">
        <div className="settings-item status">
          <span className="status-text">Status:</span>
          <div
            className={`status-box ${isVerified ? 'verified' : 'not-verified'}`}
          >
            {isVerified ? 'Verified' : 'Not Verified'}
          </div>
        </div>
        <div className="settings-item privacy-switch">
          <span className="privacy-text">Privacy:</span>
          <ToggleSwitch onToggle={onTogglePrivacy} />
        </div>
        <div className="settings-item actions" ref={dropdownRef}>
          <span className="actions-text">Actions:</span>
          <div className="icon" onClick={handleToggleDropdown}>
            <CiSettings />
          </div>
          {isDropdownVisible && (
            <Dropdown
              className="settings-dropdown"
              options={dropdownOptions}
              onOptionClick={(action) => {
                onOptionClick(action);
                setIsDropdownVisible(false); // Close the dropdown after an option is clicked
              }}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default UserSettings;
