import Image, { StaticImageData } from 'next/image';
import React from 'react';

type GalleryImageProps = {
  imageTrasform: number;
  magnitude: number;
  x: number;
  y: number;
  src: string | StaticImageData;
}

const GalleryImage = ({
  imageTrasform,
  magnitude,
  x,
  y,
  src,
}:GalleryImageProps) => {
  return (
    <div
      className='w-[200px] sm:w-[250px] xl:w-[350px] 2xl:w-[400px] h-[160px] sm:h-[250px] xl:h-[350px] 2xl:h-[400px] bg-red-500'
      style={{
        position: 'absolute',
        bottom: `${imageTrasform}%`,
        left: '50%',
        transform: `translate(calc(-50% + ${magnitude * x}px), calc(${-imageTrasform + 100}% + ${magnitude * y}px))`,
        zIndex: 0,
      }}
    >
      <Image
        src={src}
        height={500}
        width={500}
        className='w-[500px] aspect-square'
        alt='Gallery Image'
      />
    </div>
  );
};

export default GalleryImage;