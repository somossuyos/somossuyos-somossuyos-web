import React, { useEffect, useState } from 'react';
import GalleryImage from './GalleryImage';
import { galleryImages } from '@/src/utils/galleryImages';
import useWindowSize from '@/src/customHooks/useWindowSize';

type GalleryImagesProps = {
  magnitude: number;
}

const GalleryImages = ({ magnitude }: GalleryImagesProps) => {

  const [imageTrasform, setImageTransform] = useState(0);
  const [xTransformScale, setXTransformScale] = useState(1);
  const [yTransformScale, setYTransformScale] = useState(1);

  const { windowWidth } = useWindowSize();

  useEffect(() => {
    if (windowWidth < 640) {
      setXTransformScale(0.38);
      setYTransformScale(0.8);
      return;
    }
    if (windowWidth < 1280) {
      setXTransformScale(0.45);
      setYTransformScale(0.7);
      return;
    }
    if (windowWidth < 1440) {
      setXTransformScale(0.6);
      setYTransformScale(1);
      return;
    }
    setXTransformScale(0.8);
    setYTransformScale(1.2);
  }, [windowWidth]);

  useEffect(() => {
    const onScroll = () => {
      const imageContainer = document.getElementById('image-ref');
      if (imageContainer) {
        const transformValue = (1 - (imageContainer.getBoundingClientRect().top / window.innerHeight)) * 100;
        setImageTransform(Math.min(transformValue, 50));
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <>
    {
      galleryImages.map((image, index) => (
        <GalleryImage
          key={`gallery-image-${index}`}
          imageTrasform={imageTrasform}
          magnitude={magnitude}
          x={image.x * xTransformScale}
          y={image.y * yTransformScale}
          src={image.src}
        />
      ))
    }
  </>;
};

export default GalleryImages;