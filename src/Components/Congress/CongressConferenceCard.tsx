import Image from 'next/image';
import React from 'react';

type CongressConferenceCardProps = {
  name: string;
  position: string;
  profile: string;
  images?: string[] | [];
};

const CongressConferenceCard = ({ name, position, profile, images }: CongressConferenceCardProps) => {

  return (
    <div className="flex flex-col md:flex-row text-white border border-pale-skin rounded-lg p-3 md:p-6 gap-6">
      <div className='flex flex-row md:flex-col gap-4 flex-shrink-0 flex-grow-0'>
        {
          images?.map((image, i) => (
            <Image
              key={`image-${name}-${i}`}
              src={image}
              alt={`Imagen de ${name}`}
              width={200}
              height={200}
              className='w-24 h-24 rounded-full overflow-hidden border-4 border-gray-300 flex-shrink-0'
            />
          ))
        }
      </div>
      <div className="flex flex-col">
        <h2 className="text-xl font-stretch-pro text-pale-skin font-bold">{name}</h2>
        <p className="font-stretch-pro text-lg mt-1">{position}</p>
        <p className=" mt-2">{profile}</p>
      </div>
    </div>
  );
};

export default CongressConferenceCard;