import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';

type ShopItemCarouselProps = {
  title: string;
  images: string[];
}

const ShopItemCarousel = ({  images, title }: ShopItemCarouselProps) => {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    containScroll: 'trimSnaps',
  });
  const [thumbEmblaRef, thumbEmblaApi] = useEmblaCarousel({
    slidesToScroll: 1,
    containScroll: 'keepSnaps',
    dragFree: true,
    align: 'start',
    loop: false,
  });

  // Sync main and thumbs
  useEffect(() => {
    if (!emblaApi || !thumbEmblaApi) {return}
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      thumbEmblaApi.scrollTo(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi, thumbEmblaApi]);

  const onThumbClick = useCallback((index: number) => {
    if (!emblaApi) {return}
    emblaApi.scrollTo(index);
  }, [emblaApi]);

  return (
    <div className='w-full sm:w-[350px] xl:w-[500px]'>

      <div className='overflow-hidden w-full' ref={emblaRef}>
        <div className='flex'>
          {images.map((image, i) => (
            <div className='min-w-0 flex-[0_0_100%] flex justify-center items-center' key={`shop-item-image-${i}`}>
              <Image
                alt={`Imagen de ${title}`}
                src={image}
                width={500}
                height={470}
                className='object-contain'
              />
            </div>
          ))}
        </div>
      </div>
      {/* Thumbnails Carousel */}
      <div className='hidden sm:block w-full mt-4'>
        <div className='overflow-hidden' ref={thumbEmblaRef}>
          <div className='flex'>
            {images.map((image, i) => (
              <button
                type='button'
                key={`shop-item-thumb-image-${i}`}
                className={`flex-[0_0_25%] p-1 focus:outline-none ${selectedIndex === i ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => onThumbClick(i)}
                tabIndex={0}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <Image
                  alt={`Miniatura de ${title}`}
                  src={image}
                  width={120}
                  height={100}
                  className='object-contain scale-90 rounded'
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopItemCarousel;