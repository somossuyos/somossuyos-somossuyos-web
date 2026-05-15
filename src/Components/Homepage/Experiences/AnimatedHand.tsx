import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import HandImage from '@/public/img/home/mano_parallax.png';

const AnimatedHand = () => {

  const [value, setValue] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const experiencesSection = document.getElementById('experiences-section');
      if (experiencesSection && experiencesSection.getBoundingClientRect()) {
        const newValue = (experiencesSection.getBoundingClientRect().top / window.innerHeight);
        if (newValue < 0) {
          setValue(0);
          return;
        }
        if (newValue > 1) {
          setValue(1);
          return;
        }
        setValue(newValue);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Image
      src={HandImage}
      alt='Mano animada'
      className='absolute top-0 right-0 z-10 w-1/2 aspect-[981/746]'
      id='hand-home'
      style={{
        transform: `translate(${value * 100}%,-${value * 100}%)`,
        // transition: 'transform 0.25s',
      }}
    />
  );
};

export default AnimatedHand;