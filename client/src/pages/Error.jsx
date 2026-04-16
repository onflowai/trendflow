import React, { useEffect, useMemo, useState } from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import Container from '../assets/wrappers/ErrorPageContainer';
import error01Fallback from '../assets/images/error01.png';
import error02Fallback from '../assets/images/error02.png';
import errorLogo from '../assets/images/trendflow-error.svg';
import { IoIosClose } from 'react-icons/io';
import { SEOProtected } from '../components';
/**
 * Internal Error with more details and redirects to only dashboard + SSR safe
 */
const CDN_ERROR01 = 'https://cdn.trendflowai.com/content/error01.png';
const CDN_ERROR02 = 'https://cdn.trendflowai.com/content/error02.png';

const ImgWithFallback = ({ src, fallbackSrc, alt, ...rest }) => {
  const [activeSrc, setActiveSrc] = useState(src);

  useEffect(() => {
    setActiveSrc(src);
  }, [src]); //keep in sync when hover swaps src

  return (
    <img
      src={activeSrc}
      alt={alt}
      onError={() => {
        if (activeSrc !== fallbackSrc) setActiveSrc(fallbackSrc);
      }}
      {...rest}
    />
  );
};

const safeStringify = (value) => {
  try {
    if (typeof value === 'string') return value;
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const Error = () => {
  const error = useRouteError();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';//SSR-safe

  const is404 = error?.status === 404;

  const displayed = useMemo(() => {
    if (isHovered) return { cdn: CDN_ERROR02, fallback: error02Fallback };
    return { cdn: CDN_ERROR01, fallback: error01Fallback };
  }, [isHovered]);

  const handleClose = () => navigate('/dashboard');
  const handleButtonClick = () => navigate('/dashboard');
  const handleImageClick = () => navigate('/dashboard');

  const errorDetails = useMemo(() => {
    const status = error?.status ?? '';
    const statusText = error?.statusText ?? '';
    const message = error?.message ?? '';
    const data = error?.data ?? '';

    // Keep it readable + not insanely verbose
    const payload = {
      path: pathname,
      status,
      statusText,
      message,
      data,
    };

    const cleaned = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== '' && v != null)
    );

    return safeStringify(cleaned);
  }, [error, pathname]);

  useEffect(() => {
    console.log('ERROR BOUNDARY:', pathname, error);
  }, [pathname, error]);// eslint-disable-next-line no-console

  return (
    <Container>
      <SEOProtected />
      <div className="content">
        <div className="top-bar">
          <img src={errorLogo} alt="TrendFlow Logo" className="logo" />
          <div
            onClick={handleClose}
            aria-label="Close Error Page"
            className="close-button"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClose();
            }}
          >
            <IoIosClose size={24} />
          </div>
        </div>
        <div className="image-wrapper">
          <ImgWithFallback
            src={displayed.cdn}
            fallbackSrc={displayed.fallback}
            alt={is404 ? '404 Error' : 'Error'}
            className="error-emoji"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="text-wrapper">
          <h3>Something Went Wrong</h3>
          {is404 ? (
            <p>The page you are looking for does not exist.</p>
          ) : (
            <p>An unexpected error has occurred. Please try again later.</p>
          )}
          <div
            style={{
              marginTop: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.06)',
              fontSize: '12px',
              lineHeight: '16px',
              color: '#333',
              maxWidth: '100%',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            <strong style={{ display: 'block', marginBottom: '6px' }}>
              Error details:
            </strong>
            {errorDetails}
          </div>
          <button className="btn" onClick={handleButtonClick} style={{ marginTop: '14px' }}>
            Go Back Home
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Error;