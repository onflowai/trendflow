import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
/**
 * Automatic Verification Component
 * Runs when user clicks the verification link in their email
 * @returns
 */
const LandingEmailVerify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="verification-container">
      {loading ? <p>Verifying your email...</p> : <p>{message}</p>}
    </div>
  );
};

export default LandingEmailVerify;
