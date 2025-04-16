import { useState, useEffect } from 'react';

const getInitialSize = () => {
  if (typeof window === 'undefined') {
    return {
      width: 0,
      height: 0,
      isMobile: false,
      isClient: false,
    };
  }

  const width = window.innerWidth;
  return {
    width,
    height: window.innerHeight,
    isMobile: width < 992,
    isClient: true,
  };
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(getInitialSize);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 992,
        isClient: true,
      });
    };

    handleResize(); // initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
