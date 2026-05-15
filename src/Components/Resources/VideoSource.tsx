import Image from 'next/image';
import React, { useState } from 'react';

type VideoSourceProps = {
  thumbnail: string;
  link: string;
  title: string;
  subtitle: string;
};

const VideoSource = ({
  thumbnail,
  link,
  title,
  subtitle,
}: VideoSourceProps) => {

  const [hasLoaded, setHasLoaded] = useState(false);
  return (
    <div className='w-full'>
      {
        !hasLoaded ?
          <Image
            src={thumbnail}
            alt={title}
            width={480}
            height={260}
            className='w-full h-auto aspect-video'
            onClick={() => setHasLoaded(true)}
          /> :
          <iframe
            width={480}
            height={260}
            src={link}
            className='w-full h-auto aspect-video'
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
      }
      <p className='mt-6 font-futura text-[25px] leading-none text-gold paragraph-text'>{title}</p>
      <p className='mt-2 font-futura text-[20px]'>{subtitle}</p>
    </div>
  );
};

export default VideoSource;