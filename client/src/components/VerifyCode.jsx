import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiClipboard } from 'react-icons/fi';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { Logo } from '../components';

const VerifyCode = ({ initialEmail = '' }) => {
  const [email, setEmail] = useState(initialEmail);
  const [digits, setDigits] = useState(Array(6).fill('')); // storing each digit in an array of length 6
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const inputRefs = useRef([]); // create refs for each input for manual focus
  const code = digits.join(''); // derived code string

  /**
   * Handle single-digit change in one of the boxes.
   * Move focus to the next box if user typed a digit.
   */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // only allow 0-9 or empty
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    } // moving to next box if a digit is entered
  }; //end handleChange

  //handle backspace navigation (move focus to prev box if empty)
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault(); // moving focus to previous box
      inputRefs.current[index - 1].focus();
    }
  };

  //If user pastes a 6-digit string in the first box, fill all boxes.
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      const pasteDigits = pasteData.split('');
      setDigits(pasteDigits);
      // Move focus to the last box
      inputRefs.current[5].focus();
    }
  }; //end handlePaste

  //paste from clipboard
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText.length === 6 && /^\d+$/.test(clipboardText)) {
        setDigits(clipboardText.split(''));
        inputRefs.current[5].focus();
        toast.success('Code pasted from clipboard!');
      } else {
        toast.error('Clipboard does not contain a valid 6-digit code.');
      }
    } catch (err) {
      toast.error('Unable to read from clipboard. Check permissions.');
    }
  }; //end handlePasteFromClipboard

  //submitting the entire code + email to verifyCode controller
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (code.length < 6) {
      toast.error('Please enter all 6 digits.');
      return;
    }
    setLoading(true);
    try {
      const response = await customFetch.post('/auth/verify-code', {
        email,
        code,
      });
      setMessage(response.data.message);
      toast.success(response.data.message);
    } catch (error) {
      const errMsg = error?.response?.data?.msg || 'Verification failed.';
      setMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }; //end handleVerifySubmit

  //resend handler if your backend has a /auth/resend-email endpoint:
  const handleResendEmail = async () => {
    if (!email) return toast.error('Email is required');
    setLoading(true);
    try {
      const response = await customFetch.post('/auth/resend-email', { email });
      toast.success(response.data.message || 'Verification email resent.');
    } catch (error) {
      const errMsg = error?.response?.data?.msg || 'Resend failed.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }; //end handleResendEmail

  return (
    <Container>
      <Logo />
      <h2>Email Verification</h2>
      <p className="instructions">
        We sent a verification email to:{' '}
        <strong>{email || 'your-email@example.com'}</strong>. Please check your
        inbox or spam folder. If you prefer to manually verify, enter your
        6-digit code below.
      </p>
      <form onSubmit={handleVerifySubmit} className="verify-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="your-email@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="otp-container">
          <button
            type="button"
            className="paste-btn"
            onClick={handlePasteFromClipboard}
            disabled={loading}
            title="Paste Code from Clipboard"
          >
            <FiClipboard size={18} />
          </button>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={idx === 0 ? handlePaste : undefined}
              ref={(el) => (inputRefs.current[idx] = el)}
              className="otp-box"
            />
          ))}
        </div>

        <button type="submit" className=" btn" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {message && <p className="status-message">{message}</p>}

      <div className="resend-section">
        <span>Didn’t receive your verification email?</span>
        <button
          type="button"
          className="resend-btn"
          onClick={handleResendEmail}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Resend Email'}
        </button>
      </div>
    </Container>
  );
};

export default VerifyCode;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  h2 {
    margin: 1rem 0;
    font-size: 1.5rem;
  }

  .instructions {
    max-width: 400px;
    margin-bottom: 1.5rem;
    text-align: center;
    line-height: 1.4;
    strong {
      color: var(--primary-500);
    }
  }

  .verify-form {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .form-group {
      display: flex;
      flex-direction: column;

      label {
        margin-bottom: 0.5rem;
        font-weight: bold;
      }
      input {
        padding: 0.5rem;
        border: 1.5px solid var(--grey-70);
        border-radius: var(--input-radius-rounded);
        font-size: 1rem;
      }
    }

    .otp-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: space-between;
      position: relative;

      .otp-box {
        width: 2.5rem;
        height: 3rem;
        font-size: 1.25rem;
        text-align: center;
        border: 1.5px solid var(--grey-70);
        border-radius: var(--input-radius-rounded);
      }

      .paste-btn {
        color: var(--grey-800);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        outline: none;
      }

      .paste-btn:hover {
        color: var(--grey-300);
      }

      .paste-btn:active {
        color: var(--grey-400);
      }

      .paste-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .verify-btn {
      align-self: flex-end;
      padding: 0.6rem 1.2rem;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: var(--primary-700);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }

  .status-message {
    margin-top: 1rem;
    text-align: center;
    max-width: 400px;
    font-weight: 500;
    color: var(--grey-700);
  }

  .resend-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1.5rem;
    font-size: 0.95rem;
    gap: 0.5rem;

    .resend-btn {
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: var(--input-radius-rounded);
      background-color: var(--primary-400);
      color: #fff;
      cursor: pointer;
      transition: background-color 0.3s ease;
      font-size: 0.95rem;

      &:hover {
        background-color: var(--primary-700);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }

  @media (max-width: 480px) {
    .instructions,
    .verify-form,
    .status-message,
    .resend-section {
      max-width: 90%;
    }

    .otp-container {
      gap: 0.3rem;
      .otp-box {
        width: 2rem;
        height: 2.5rem;
      }
    }
  }
`;
