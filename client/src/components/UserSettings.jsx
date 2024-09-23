import React, { useState, useRef, useEffect } from 'react';
import Container from '../assets/wrappers/UserSettingsContainer';
import { githubUrl } from '../utils/urlHelper';
import {
  FormComponentButton,
  ToggleSwitch,
  Dropdown,
  FormComponentLogoBtn,
} from '../components';
import { CiSettings } from 'react-icons/ci';
/**
 *
 * @param {*} param0
 * @returns
 */
const UserSettings = ({
  email,
  githubUsername,
  isVerified,
  onUpdateEmail,
  onTogglePrivacy,
  onOptionClick,
  onUpdateGithubUsername,
}) => {
  //EMAIL UPDATE
  const handleUpdateEmail = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target.closest('form'));
    onUpdateEmail({ request: { formData } });
  };
  //GITHUB USERNAME UPDATE
  const handleUpdateGithub = (username) => {
    if (!username) {
      return toast.error(
        <CustomErrorToast
          message={`Please append your username to "${githubUrl()}<username>"`}
        />
      );
    }
    const body = JSON.stringify({ githubUsername: username }); //JSON object with githubUsername
    onUpdateGithubUsername({ body }); // passing the JSON body directly to the function
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
        <FormComponentLogoBtn
          type="text"
          name="link github account"
          defaultValue={githubUsername}
          buttonText="Link Github"
          onClick={handleUpdateGithub}
          baseUrl="github.com/"
          iconUrl="/assets/github-actions.svg"
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
