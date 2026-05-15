import Image from 'next/image';
import SBackground from '@/public/img/home/S_fondo.png';
import HomeTitleLink from './HomeTitleLink';
import InstagramIcon from '@/public/img/icons/instagram.svg';
import YoutubeIcon from '@/public/img/icons/youtube.svg';
import SpotifyIcon from '@/public/img/icons/spotify.svg';
import PodcastIcon from '@/public/img/icons/podcast.svg';

const HomeTitle = () => {
  return (
    <div className='w-full h-[50vh] sm:h-screen relative'>
      <Image
        src={SBackground}
        alt='SBackground'
        className='lg:h-full aspect-[1202/1078] absolute top-0 left-0 pointer-events-none'
        priority
      />
      <div className='absolute -translate-y-1/2 sm:translate-y-0 top-[25vh] sm:top-[25vh] xl:top-[43vh] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center h-fit w-full'>
        <div className='w-fit mx-4 flex flex-col items-center justify-center'>
          <p className='font-stretch-pro text-[28px] sm:text-[50px] xl:text-[70px] 2xl:text-[90px] leading-none mt-[100px]'>&quot;Él nos hizo y</p>
          <div className="grid grid-cols-2 place-items-end gap-4">
            <div className='w-full h-[90%] bg-transparent' id='video-ref'></div>
            <div>
              <p className='text-[25px] sm:text-[45px] xl:text-[72px] 2xl:text-[96px] text-pale-skin font-stretch-pro'>somos</p>
              <p className='text-[32px] sm:text-[55px] xl:text-[85px] 2xl:text-[110px] text-pale-skin font-stretch-pro'>suyos&quot;</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4 absolute top-[220px] sm:right-[50px] xl:right-[120px]'>
          <HomeTitleLink
            image={InstagramIcon}
            ariaLabel='Enlace a instagram Instagram'
            href='https://www.instagram.com/somos.sos/'
          />
          <HomeTitleLink
            image={YoutubeIcon}
            ariaLabel='Enlace a youtube Youtube'
            href='https://www.youtube.com/@SomosSuyos'
          />
          <HomeTitleLink
            image={SpotifyIcon}
            ariaLabel='Enlace a spotify Spotify'
            href='https://open.spotify.com/show/1mocQ1i2ej5yYu2GdID0zJ'
          />
          <HomeTitleLink
            image={PodcastIcon}
            ariaLabel='Enlace a podcast Podcast'
            href='https://open.spotify.com/show/1mocQ1i2ej5yYu2GdID0zJ'
          />
        </div>
      </div>
      <p className='absolute bottom-1 sm:bottom-4 right-4 sm:right-[50px] xl:right-[180px] text-[10px] sm:text-[20px] font-futura text-pale-skin'>- Salmo 99.</p>
    </div>
  );
};

export default HomeTitle;