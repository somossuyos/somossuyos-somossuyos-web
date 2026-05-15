import { Media, MediaData } from '@/src/entities/types/SharedTypes';
import RelatedExperience from './RelatedExperience';

export type RelatedExperience = {
  id: number;
  thumbnail?: MediaData<Media>;
  title: string;
  month: string;
  path: string;
  isDateSet: boolean;
  soldOut: boolean;
};

interface ExperienceRelatedProps {
  relatedExperiences: RelatedExperience[];
  soldOut: boolean;
}

const ExperienceRelated = ({ relatedExperiences, soldOut }: ExperienceRelatedProps) => {
  if (relatedExperiences.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row relative z-0 py-10 px-4 sm:px-[30px] xl:px-[100px] 2xl:px-[160px] items-end justify-center mt-[100px] xl:mt-[200px]">
      <div className="w-full top-0 md:top-auto md:bottom-0 left-0 absolute bg-pale-skin h-[200px] md:h-[400px] xl:h-[465px] z-0"></div>
      <h3 className="text-black relative z-10 sm:text-right mr-[20px] sm:mr-[35px] xl:mr-[75px] 2xl:mr-[115px] mb-[50px] sm:mb-[170px] font-stretch-pro text-[25px] sm:text-[40px] xl:text-[60px] 2xl:text-[80px] leading-none 2xl:leading-[45px]">
        Otras <br />
        <span className="font-dark-twenty text-[40px] sm:text-[55px] xl:text-[70px] 2xl:text-[100px]">
          Experiencias
        </span>
      </h3>
      <div className="flex flex-col md:flex-row relative z-0 gap-[50px]">
        {relatedExperiences.map(
          ({ month, path, id, title, thumbnail, isDateSet }) => {
            return (
              <RelatedExperience
                key={`related-experience-${id}`}
                month={month}
                title={title}
                path={path}
                src={thumbnail?.data.attributes.url}
                isDateSet={isDateSet}
                soldOut={soldOut}
              />
            );
          }
        )}
      </div>
    </div>
  );
};

export default ExperienceRelated;