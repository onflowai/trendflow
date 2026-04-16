import React from 'react';
import styled from 'styled-components';
import { AiFillSound, AiOutlineSound } from 'react-icons/ai';
import { FaPause, FaPlay } from 'react-icons/fa';
import LoadingBar from './LoadingBar';
/**
 * AudioControls component display audio button and pause and play
 * @param {*} param0 
 * @returns 
 */
const AudioControls = ({
  isActive,
  isPaused,
  onStart,
  onPause,
  onResume,
  onCancel,
  showLoading = false, // show loading bar while active
  className,
}) => {
  return (
    <Controls className={className}>
      {!isActive ? (
        <button type="button" onClick={onStart} aria-label="Play audio" className="btn">
          <AiOutlineSound size={23} />
        </button>
      ) : (
        <button type="button" onClick={onCancel} aria-label="Cancel audio" className="btn">
          <AiFillSound size={23} />
        </button>
      )}

      {isActive && !isPaused ? (
        <button type="button" onClick={onPause} aria-label="Pause audio" className="btn">
          <FaPause size={18} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onResume}
          aria-label="Resume audio"
          disabled={!isActive}
          className="btn"
        >
          <FaPlay size={18} />
        </button>
      )}

      {showLoading && isActive && (
        <div className="loader">
          <LoadingBar paused={isPaused} />
        </div>
      )}
    </Controls>
  );
};

export default AudioControls;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 0.75rem 0;

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.35rem;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    line-height: 0;
  }

  .btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .btn svg {
    color: #7a7b7a;// --grey-400:
  }

  .loader {
    flex: 1;
    min-width: 120px;
  }
  @media (max-width: 991px) {
    padding-top: 1.5rem;
  }
`;