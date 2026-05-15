import { useState, useEffect } from 'react';

function useWindowSize() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {

    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { windowWidth, windowHeight };
}

export default useWindowSize;