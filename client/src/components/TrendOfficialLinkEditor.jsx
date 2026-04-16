import React from 'react';
import styled from 'styled-components';

/**
 * 
 * @param {*} param0
 * @returns
 */
const TrendOfficialLinkEditor = ({
  value,
  onChange,
  onUpdate,
  isUpdating,
  iconUrl = '/assets/trend-link.svg',
}) => {
  const normalizedForOpen = normalizeUrlForOpen(value);
  const canOpen = !!normalizedForOpen;

  const handleOpen = () => {
    if (!normalizedForOpen) return;
    window.open(normalizedForOpen, '_blank', 'noopener,noreferrer');
  };

  return (
    <Wrap>
      <label className="label">Official Link</label>

      <div className="row">
        <input
          className="input"
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com"
          autoComplete="off"
          spellCheck={false}
        />

        <button
          type="button"
          className="icon-btn"
          onClick={handleOpen}
          disabled={!canOpen}
          title={canOpen ? 'Open link' : 'Invalid / empty link'}
        >
          <img className="icon" src={iconUrl} alt="Open link" />
        </button>

        <button
          type="button"
          className="btn "
          onClick={onUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? 'updating…' : 'Update Link'}
        </button>
      </div>

      <p className="hint">
        Must be http/https. Yes, “www dot” with no scheme is still not a URL.
      </p>
    </Wrap>
  );
};

export default TrendOfficialLinkEditor;

const normalizeUrlForOpen = (raw) => {
  const val = String(raw || '').trim();
  if (!val) return '';
  if (!/^https?:\/\//i.test(val)) return `https://${val}`;  // if user forgot scheme assume https for opening only
  try {
    new URL(val);
    return val;
  } catch {
    return '';
  }// validate basic URL shape
};// helpers

const Wrap = styled.div`
  margin-top: 16px;

  .label {
    display: block;
    margin-bottom: 6px;
    color: var(--grey-100);
    font-weight: 600;
  }

  .row {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .input {
    flex: 1;
    height: 42px;
    padding: 0 14px;
    border: 1.5px solid var(--grey-50);
    border-radius: 999px;
    background: var(--white);
    color: var(--grey-100);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .input:focus {
    border-color: var(--primary-400);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
  }

  .icon-btn {
    height: 42px;
    width: 42px;
    border: 1.5px solid var(--grey-50);
    border-radius: 999px;
    background: var(--white);
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .icon-btn:hover:not(:disabled) {
    border-color: var(--primary-400);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .icon-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }

  .icon {
    width: 26px;
    height: 26px;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .hint {
    margin-top: 8px;
    font-size: 0.9rem;
    color: var(--grey-70);
  }
`;