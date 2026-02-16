// File: /client/src/components/CustomInfoToast.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

import localFallbackTech from '../assets/images/fallback-tech.svg';

const CDN_FALLBACK_TECH = 'https://cdn.trendflowai.com/content/fallback-tech.svg';

const CustomInfoToast = ({
  trendName = 'Visit',
  to,
  onClick,
  isDarkTheme = false,
}) => {
  const [useLocal, setUseLocal] = useState(false);
  const iconSrc = useLocal ? localFallbackTech : CDN_FALLBACK_TECH;

  const canLink = Boolean(to);

  return (
    <Container $isDark={isDarkTheme}>
      <div className="row">
        <img
          src={iconSrc}
          alt="Info"
          className="icon"
          onError={() => setUseLocal(true)}
          draggable={false}
        />

        <div className="content">
          <div className="msg">
            Trend{' '}
            {canLink ? (
              <a
                className="trendLink"
                href={to}
                onClick={() => onClick?.()}
              >
                {trendName}
              </a>
            ) : (
              <span className="trendName">{trendName}</span>
            )}{' '}
            already exists.
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CustomInfoToast;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .icon {
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    opacity: 0.95;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.15;
  }

  .msg {
    font-size: 0.92rem;
    margin: 0;
    color: ${({ $isDark }) =>
      $isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.85)'};
  }

  .trendName {
    font-weight: 800;
  }

  .trendLink {
    font-weight: 800;
    text-decoration: underline;
    color: ${({ $isDark }) =>
      $isDark ? 'rgba(120, 200, 255, 0.95)' : 'rgba(0, 102, 204, 0.95)'};
    cursor: pointer;
  }

  .trendLink:hover {
    opacity: 1;
  }
`;