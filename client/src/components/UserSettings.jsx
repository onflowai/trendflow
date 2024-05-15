import React from 'react';
import Container from '../assets/wrappers/UserDropdownContainer';
import { FormComponent } from '../components';
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
      <h5 className="header">Settings:</h5>
      <div className="email-section">
        <div className="email-form">
          <FormComponent type="email" name="email" defaultValue={email} />
        </div>
        <button className="update-button" onClick={handleUpdateEmail}>
          Update
        </button>
      </div>
      <div className="settings-section">
        <div className="status">
          <span className="status-text">Status:</span>
          <div>{isVerified ? 'Verified' : 'Not Verified'}</div>
        </div>
        <div className="privacy-switch">
          <span className="privacy-text">Privacy:</span>
          <input type="checkbox" onChange={onTogglePrivacy} />
        </div>
        <div className="actions">
          <span>Actions:</span>
          <div className="icon">
            <CiSettings />
          </div>{' '}
          {/* Use a settings icon here */}
        </div>
      </div>
    </Container>
  );
};

export default UserSettings;
