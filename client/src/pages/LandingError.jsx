import React, { useMemo, useState } from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import Container from '../assets/wrappers/ErrorPageContainer';
import errorLogo from '../assets/images/trendflow-error.svg';

import error01Fallback from '../assets/images/error01.png';
import error02Fallback from '../assets/images/error02.png';

import { IoIosClose } from 'react-icons/io';

/**
 * Public-facing error page SSR safe CDN first local fallback if CDN fails
 */
const CDN_ERROR01 = 'https://cdn.trendflowai.com/content/error01.png';
const CDN_ERROR02 = 'https://cdn.trendflowai.com/content/error02.png';

const ImgWithFallback = ({
  src,
  fallbackSrc,
  alt,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) => {
  const [activeSrc, setActiveSrc] = useState(src);

  React.useEffect(() => {
    setActiveSrc(src);
  }, [src]);// if the hovered src changes update what we try to show

  return (
    <img
      src={activeSrc}
      alt={alt}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onError={() => {
        if (activeSrc !== fallbackSrc) setActiveSrc(fallbackSrc);
      }}
      {...rest}
    />
  );
};

const LandingError = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);

  const message =
    error?.statusText ||
    error?.message ||
    'Sorry, something went wrong loading this page.';

  const is404 = error?.status === 404;
  console.log('ERROR BOUNDARY:', window?.location?.pathname, error);
  const goHome = () => {
    navigate('/');
  };

  const handleClose = () => {
    navigate('/');
  };

  const imgConfig = useMemo(() => {
    return isHovered
      ? { cdn: CDN_ERROR02, fallback: error02Fallback }
      : { cdn: CDN_ERROR01, fallback: error01Fallback };
  }, [isHovered]);

  return (
    <Container>
      <div className="content">
        {/* Top Bar */}
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
        {is404 ? (
          <div className="image-wrapper">
            <ImgWithFallback
              src={imgConfig.cdn}
              fallbackSrc={imgConfig.fallback}
              alt="404 Error"
              className="error-emoji"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={goHome}
              style={{ cursor: 'pointer' }}
            />
          </div>
        ) : null}
        <div className="text-wrapper">
          <h3>Something Went Wrong</h3>
          {is404 ? (
            <p>The page you are looking for does not exist.</p>
          ) : (
            <p>{message}</p>
          )}
          <button className="btn" onClick={goHome}>
            Go Back Home
          </button>
        </div>
      </div>
    </Container>
  );
};

export default LandingError;