import React from 'react';
import Container from '../assets/wrappers/UserSettingsContainer';
import { FormComponentButton } from '../components';
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
}) => {
  const handleUpdateEmail = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target.closest('form'));
    onUpdateEmail({ request: { formData } });
  };
  console.log('Email', email);
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
          <div>{isVerified ? 'Verified' : 'Not Verified'}</div>
        </div>
        <div className="settings-item privacy-switch">
          <span className="privacy-text">Privacy:</span>
          <input type="checkbox" onChange={onTogglePrivacy} />
        </div>
        <div className="settings-item actions">
          <span>Actions:</span>
          <div className="icon">
            <CiSettings />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserSettings;
