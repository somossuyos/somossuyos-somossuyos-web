import React, { useEffect, useState } from 'react';

type AnimatedTitleProps = {
  title: string,
  isLast?: boolean
  className?: string
}

const AnimatedTitle = ({ title, isLast, className }: AnimatedTitleProps) => {

  const [animTranslate, setAnimTranslate] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const galleryTitle = document.getElementById('gallery-title');
      if (galleryTitle) {
        const transformValue = 1.75 * (galleryTitle.getBoundingClientRect().top / window.innerHeight) * 100;
        setAnimTranslate(transformValue <= 100 ? transformValue : 100);
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className='h-fit w-fit overflow-hidden '
    >
      <p
        className={className ?? ''}
        style={{
          transform: `translateY(${animTranslate}%)`,
          position: 'relative',
          zIndex: isLast ? 100 : 0,
        }}
      >{title}</p>
    </div>
  );
};

export default AnimatedTitle;