import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Container from '../assets/wrappers/ErrorPageContainer';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import successLogo from '../assets/images/trendflow-success.svg';
import { IoIosClose } from 'react-icons/io';

import customFetch from '../utils/customFetch';
import { SEOProtected } from '../components';

const LandingEmailVerify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await customFetch.get(
          `/auth/verify-email?token=${token}`
        );
        setMessage(response.data.message);
        toast.success(response.data.message);
      } catch (error) {
        const errMsg = error?.response?.data?.msg || 'Verification failed.';
        setMessage(errMsg);
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verify();
    } else {
      setMessage('Invalid verification token.');
      toast.error('Invalid verification token.');
      setLoading(false);
    }
  }, [token]);

  // 1-second automatic redirect to /login
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 10000);
      // Cleanup if the component unmounts before 1 second:
      return () => clearTimeout(timer);
    }
  }, [loading, navigate]);

  const handleClose = () => {
    // If user clicks close, also navigate to /login
    navigate('/login');
  };

  return (
    <Container>
      <SEOProtected />
      <div className="content">
        <div className="top-bar">
          <img src={successLogo} alt="TrendFlow Logo" className="logo" />
          <div
            onClick={handleClose}
            aria-label="Close"
            className="close-button"
          >
            <IoIosClose size={24} />
          </div>
        </div>
        <div className="text-wrapper">
          <h3>
            {loading
              ? 'Verifying Your Email...'
              : 'Thank You for Verifying Your Email!'}
          </h3>
          <p>{message}</p>
          <button className="btn" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </div>
    </Container>
  );
};

export default LandingEmailVerify;
