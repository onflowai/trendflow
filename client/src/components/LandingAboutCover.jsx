import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import useWindowSize from '../hooks/useWindowSize';

const LandingAboutCover = () => {
  const { isMobile } = useWindowSize(); // <--- replaces ScreenSizeContext
  const [coverUrl, setCoverUrl] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 26) + 1;
    if (isMobile) {
      setCoverUrl(
        `https://cdn.onflowai.com/covers/small/cover-small${randomIndex}.jpg`
      );
    } else {
      setCoverUrl(
        `https://cdn.onflowai.com/covers/medium/cover-medium${randomIndex}.jpg`
      );
    }
    setIsLoaded(false); // Reset loading state whenever coverUrl changes
  }, [isMobile]);

  return (
    <StyledCover>
      {coverUrl && (
        <img
          className={`background-image ${isLoaded ? 'visible' : ''}`}
          src={coverUrl}
          alt="Background"
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </StyledCover>
  );
};

const StyledCover = styled.div`
  width: 100%;
  height: 100%;

  .background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 1rem;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .background-image.visible {
    opacity: 1;
  }
`;

export default LandingAboutCover;
