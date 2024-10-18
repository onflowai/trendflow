import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 992);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

export default useWindowSize;
