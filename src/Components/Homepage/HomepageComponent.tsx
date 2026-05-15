import HomeTitle from './Hero/HomeTitle';
import NextExperience from './NextExperience';
import Gallery from './Gallery/Gallery';
import YouTubeChannel from './YouTubeChannel';
import Experencies from './Experiences/Experencies';
import HeLives from './HeLives/HeLives';
import NextEvents from './NextEvents/NextEvents';
import { HomePageProps } from '@/pages';
import ImagePhrase from './ImagePhrase';
import Donations from './Donations';
import dynamic from 'next/dynamic';

const Video = dynamic(() => import('./Hero/Video'), {
  ssr: false,
  loading: () => (
    <></>
  )
});

type HomepageComponentProps = HomePageProps;

const HomepageComponent = ({ nextExperience, experiences, events }: HomepageComponentProps) => {
  return (
    <div className='relative w-full overflow-hidden'>
      <HomeTitle />
      <Video />
      <NextExperience {...nextExperience} />
      <Gallery />
      <YouTubeChannel />
      {
        experiences.length > 0 && <Experencies experiences={experiences} />
      }
      <HeLives />
      {
        events.length > 0 && <NextEvents events={events} />
      }
      <ImagePhrase />
      <Donations />
    </div>
  );
};

export default HomepageComponent;