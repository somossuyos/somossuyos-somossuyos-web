import useWindowSize from '@/src/customHooks/useWindowSize';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import ArrowSVG from '../../SVG/ArrowSVG';

// eslint-disable-next-line max-lines-per-function
const Video = () => {

  const [scale, setScale] = useState(0);
  const [isInBottom, setIsInBottom] = useState(false);
  const [borderRadius, setBorderRadius] = useState(30);
  const [initialPosition, setInitialPosition] = useState<{
    x: number,
    y: number,
    width: number,
    height: number,
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

  const { windowWidth, windowHeight } = useWindowSize();

  const setVideoPosition = () => {
    const videoRef = document.getElementById('video-ref');
    if (videoRef) {

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const { x, y, width, height } = videoRef.getBoundingClientRect();

      const scroll = window.scrollY;

      setInitialPosition({
        x: (screenWidth / 2) - x - (width / 2),
        y: (screenHeight / 2) - (y + scroll) - (height / 2),
        width,
        height
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;

      const videoContainer = document.getElementById('main-video-container');
      if (videoContainer && videoContainer.getBoundingClientRect().bottom < window.innerHeight) {
        setIsInBottom(true);
      } else {
        setIsInBottom(false);
      }

      const newScale = (scroll / window.innerHeight);
      setScale(newScale > 1 ? 1 : newScale);
    };

    window.addEventListener('scroll', handleScroll);

    setVideoPosition();

    return () => window.removeEventListener('scroll', handleScroll);

  }, []);


  useEffect(() => {

    setVideoPosition();

    if (windowWidth < 640) {
      setBorderRadius(10);
      return;
    }
    if (windowWidth < 1280) {
      setBorderRadius(20);
      return;
    }
    if (windowWidth < 1440) {
      setBorderRadius(25);
      return;
    }
    setBorderRadius(30);
  }, [windowWidth, windowHeight]);

  return (
    <div className="h-[150vh] sm:h-[200vh] relative bg-transparent" id="main-video-container">
      <video
        style={{
          position: !isInBottom ? 'fixed' : 'absolute',
          bottom: !isInBottom ? '50%' : '0%',
          left: '50%',
          transform: `translate(calc(-50% - ${(initialPosition.x ?? 0) * (1 - scale)}px), calc(${!isInBottom ? '50%' : '0%'} - ${(initialPosition.y ?? 0) * (1 - scale)}px))`,
          width: `calc(${initialPosition.width * (1 - scale)}px + ${scale * 100}vw)`,
          height: `calc(${initialPosition.height * (1 - scale)}px + (${scale * 100}vh))`,
          borderRadius: scale < 1 ? `${(1 - scale) * borderRadius}px` : '0%',
          objectFit: 'cover',
          aspectRatio: '16/9',
        }}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        src={isMobile ? '/Movil.mp4' : '/Web.mp4'}
        typeof='video/mp4'
      />
      <div
        className='fixed bottom-8 flex flex-col items-center justify-center w-full animate-bounce'
        style={{
          opacity: 1 - scale
        }}
      >
        <p className='text-pale-skin'>Haz scroll hacia abajo</p>
        <ArrowSVG
          className='w-6 h-6 text-pale-skin'
          fill='currentColor'
        />
      </div>
    </div>
  );
};

export default Video;