import React from 'react';
import styled from 'styled-components';

const LandingModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Container>
      <div className="overlay">
        <div className="modal-content">
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close Modal"
          >
            &times;
          </button>
          {/* RENDERING CHILDREN */}
          {children}
          {/* RENDERING CHILDREN */}
        </div>
      </div>
    </Container>
  );
};

export default LandingModal;

const Container = styled.div`
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    position: relative;
    background: var(--white);
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
  }
`;
