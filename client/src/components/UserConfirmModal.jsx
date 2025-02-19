import React from 'react';
import styled from 'styled-components';
import { IoIosClose } from 'react-icons/io';
/**
 * Custom user confirm component: takes on icons (MAX 3),
 * a message and onConfirm before proceeding to process
 * @param {*} param0
 * @returns
 */
const UserConfirmModal = ({
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
  userImg = '',
  userName = '',
  icons = [],
  confirmMessage,
  subMessage,
}) => {
  if (!isOpen) return null;
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Container>
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>
            <IoIosClose />
          </button>
          <div className="icon-row">
            {icons.slice(0, 3).map((Icon, index) => (
              <div className="icon-wrapper" key={index}>
                {Icon}
              </div>
            ))}
          </div>
          {userImg && <img src={userImg} alt="User" className="user-img" />}
          {userName && <h3>{userName}</h3>}
          <p className="confirm-message">{confirmMessage}</p>
          <p className="sub-message">{subMessage}</p>

          <div className="btn-row">
            <button
              className="btn btn-color confirm-btn"
              onClick={handleConfirm}
            >
              Confirm
            </button>
            <button className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  .modal-content {
    background: var(--add-trend-modal-color);
    width: 90%;
    max-width: 480px;
    border-radius: 8px;
    padding: 2rem;
    position: relative;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
  }
  .icon-row {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }
  .icon-wrapper {
    margin: 0 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .icon-wrapper img,
  .icon-wrapper svg {
    width: 40px;
    height: 40px;
  }
  .user-img {
    display: block;
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: 50%;
    margin: 0.5rem auto 1rem auto;
  }

  h3 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .confirm-message {
    text-align: center;
    line-height: 1.4;
    font-size: 1.5rem;
  }
  .sub-message{
    text-align: center;
    line-height: 1.4;
    font-size: 1rem;
  }
  .btn-row {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .btn {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    .modal-content {
      padding: 1.5rem;
    }
    .confirm-message {
      font-size: 0.95rem;
      font-weight: 300;
    }
    .icon-wrapper img,
    .icon-wrapper svg {
      width: 32px;
      height: 32px;
    }
  }
`;

export default UserConfirmModal;
