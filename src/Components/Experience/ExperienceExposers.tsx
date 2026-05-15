import CongressConferenceCard from '../Congress/CongressConferenceCard';
import { SpeakerDto } from '@/src/infrastructure/DTOs/Experiences';

interface ExperienceExposersProps {
  exposers?: SpeakerDto[];
}

const ExperienceExposers = ({ exposers }: ExperienceExposersProps) => {
  if (!exposers || exposers.length === 0) {
    return null;
  }

  return (
    <div className="px-[10%] xl:px-[80px] grid xl:grid-cols-2 gap-5 xl:gap-10 mt-5 lg:mt-10">
      {exposers.map((exposer, idx) => {
        return (
          <CongressConferenceCard
            key={`exposer-${exposer.names}-${idx}`}
            name={exposer.names}
            position={exposer.names}
            profile={exposer.description}
            images={[
              exposer.photo?.data?.attributes?.url,
              exposer.affiliationPhoto?.data?.attributes?.url
            ].filter(Boolean) as string[]}
          />
        );
      })}
    </div>
  );
};

export default ExperienceExposers;