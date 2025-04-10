import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const isClient = typeof window !== 'undefined'; //ssr safe check

  const getIsMobile = () => {
    return isClient ? window.innerWidth < 992 : false;
  };

  const [isMobile, setIsMobile] = useState(getIsMobile); //initial value

  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);

  return isMobile;
};

export default useWindowSize;
