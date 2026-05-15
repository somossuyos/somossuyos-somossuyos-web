
/* eslint-disable react-hooks/exhaustive-deps */
import { DEFAULT_SLIDE_COUNT, DEFAULT_SLIDE_INTERVAL, DEFAULT_TRANSITION_TIME, MAX_PERCENTAGE } from '@/src/utils/const';
import { useState, useEffect, Dispatch, ReactNode, SetStateAction } from 'react';

type CustomCarouselProps = {
  children: ReactNode[] | Element[] | JSX.Element[];
  slideIndex: number;
  customKey: string;
  slideCount?: number;
  buttonNext?: ReactNode;
  buttonNextClassname?: string;
  buttonPrev?: ReactNode;
  buttonPrevClassname?: string;
  containerClassname?: string;
  transitionTime?: number;
  slideInterval?: number;
  indicatorContainerClassName?: string;
  scrollClassName?: string;
  scrollEnabled?: boolean;
  setIndex: Dispatch<SetStateAction<number>>;
}

// eslint-disable-next-line max-lines-per-function
const CustomCarousel = ({
  children,
  slideCount = DEFAULT_SLIDE_COUNT,
  setIndex,
  slideIndex,
  customKey,
  buttonPrev,
  buttonPrevClassname,
  buttonNext,
  buttonNextClassname,
  containerClassname,
  transitionTime = DEFAULT_TRANSITION_TIME,
  slideInterval = DEFAULT_SLIDE_INTERVAL,
  indicatorContainerClassName,
  scrollClassName,
  scrollEnabled = false
}: CustomCarouselProps) => {

  const [isGoingForward, setIsGoingForward] = useState(true);
  const [isChanging, setIsChanging] = useState(false);
  const [internIndex, setInternIndex] = useState(0);

  useEffect(() => {
    if (isChanging || slideIndex === internIndex) { return }
    const nextIndex = internIndex + 1 < children?.length ? internIndex + 1 : 0;
    const prevIndex = internIndex - 1 >= 0 ? internIndex - 1 : children?.length ?? 0 - 1;
    if (slideIndex === nextIndex) { setNextIndex() }
    if (slideIndex === prevIndex) { setPrevIndex() }
  }, [slideIndex]);

  useEffect(() => {
    const newIntervalId = setInterval(() => {
      setNextIndex(true);
    }, slideInterval);
    return () => clearInterval(newIntervalId);
  }, [internIndex]);

  const setNextIndex = (isAdding: boolean = false, transition: number = transitionTime) => {
    if (isChanging) { return }
    setIsGoingForward(true);
    setIsChanging(true);
    if (isAdding) {
      const nextIndex = slideIndex + 1 < children?.length ? slideIndex + 1 : 0;
      setIndex(nextIndex);
    }
    const timeOut = setTimeout(() => {
      setInternIndex(prev => prev + 1 < children?.length ? prev + 1 : 0);
      setIsChanging(false);
      clearTimeout(timeOut);
    }, transition);
  };

  const setPrevIndex = (isAdding: boolean = false, transition: number = transitionTime) => {
    if (isChanging) { return }
    setIsGoingForward(false);
    setIsChanging(true);
    if (isAdding) {
      const prevIndex = slideIndex - 1 >= 0 ? slideIndex - 1 : children?.length ?? 0 - 1;
      setIndex(prevIndex);
    }
    const timeOut = setTimeout(() => {
      setInternIndex(prev => prev - 1 >= 0 ? prev - 1 : children?.length ?? 0 - 1);
      setIsChanging(false);
      clearTimeout(timeOut);
    }, transition);
  };

  if (slideCount === (children?.length ?? 0) && scrollEnabled) {
    return <div className={scrollClassName ?? 'flex gap-10 flex-nowrap w-full overflow-scroll'}>
      {
        children.map((child, i) => (
          <div key={`no-carousel-${customKey}-${i}`} className='flex items-center justify-center'>
            {child as React.ReactNode}
          </div>
        ))
      }
    </div>;
  }

  return (
    <div className='relative flex flex-col items-center justify-center w-full'>
      <div className="relative flex w-full items-center justify-center">
        <button
          className={buttonPrevClassname ? buttonPrevClassname : ''}
          aria-label='Item anterior'
          onClick={() => { setPrevIndex(true) }}>
          {
            buttonPrev ? buttonPrev : '<'
          }
        </button>
        <div className={`w-full relative ${containerClassname ? containerClassname : ''} overflow-hidden`}>
          <div
            className="flex relative h-fit z-0"
            style={{
              width: `${((
                isChanging && !isGoingForward ? children?.length ?? 0 + 1 : children?.length ?? 0
              ) / slideCount) * MAX_PERCENTAGE}%`,
              transform: isChanging ? `translateX(${isGoingForward ? '-' : ''}${(MAX_PERCENTAGE / (
                isChanging && !isGoingForward ? children?.length ?? 0 + 1 : children?.length ?? 0
              ))}%)` : 'translateX(0)',
              transition: isChanging ? `transform ${transitionTime}ms ease-in-out` : 'none',
              marginLeft: isChanging && !isGoingForward ? `-${(MAX_PERCENTAGE / slideCount)}%` : '0'
            }}
          >
            {
              isChanging &&
              !isGoingForward &&
              <div
                className='flex items-center justify-center'
                style={{
                  width: `${MAX_PERCENTAGE / slideCount}%`
                }}
              >
                {children[
                  internIndex - 1 < 0
                    ? children?.length ?? 0 - 1
                    : internIndex - 1
                ] as React.ReactNode}
              </div>
            }
            {
              children?.map((child, i) => {
                let newIndex = i + internIndex;
                if (newIndex >= children?.length) { newIndex = i + internIndex - children?.length}
                return (
                  <div
                    key={`carousel-${customKey}-${i}`}
                    className='flex items-center justify-center'
                    style={{
                      width: `${MAX_PERCENTAGE / slideCount}%`
                    }}
                  >
                    {children[newIndex] as React.ReactNode}
                  </div>
                );
              })
            }
          </div>
        </div>
        <button
          onClick={() => { setNextIndex(true) }}
          aria-label='Próximo item'
          className={buttonNextClassname ? buttonNextClassname : ''}
        >
          {
            buttonNext ? buttonNext : '>'
          }
        </button>
      </div>
      <div className={indicatorContainerClassName ?? ''}>
        {
          children?.map((_, i) => (
            <button
              key={`carousel-button-${customKey}-${i}`}
              onClick={() => setIndex(i)}
              aria-label={`Ir al item ${i + 1}`}
              className={`w-2 h-2 rounded-full mx-1 transition-colors duration-1000 ${slideIndex === i ? 'bg-[#198AED]' : 'bg-[#EBE5FC]'}`}
            />
          ))
        }
      </div>
    </div>
  );
};

export default CustomCarousel;