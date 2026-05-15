import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';
import HandImage from '@/public/img/home/mano_parallax.png';

interface ExperienceHeaderProps {
  type: string;
  month: string;
  isDateSet: boolean;
  header: {
    firstPart: string;
    secondPart: string;
  };
}

const ExperienceHeader = ({ type, month, isDateSet, header }: ExperienceHeaderProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  return (
    <>
      <Image
        src={HandImage}
        alt="Mano animada"
        className="absolute top-[250px] xl:top-[450px] right-0 z-10 w-[150px] 2xl:w-[15%] aspect-[981/746] hidden md:block"
        id="hand-home"
        style={{
          transform: `translate(${!hasLoaded ? '100%' : '0%'}, ${
            !hasLoaded ? '-100%' : '0%'
          })`,
          transition: 'transform 1s ease-out',
        }}
      />

      {/* Mobile Header */}
      <h2 className="ml-8 xl:ml-[250px] font-stretch-pro text-[25px] xl:text-[80px] leading-none xl:leading-[70px] relative z-10 md:hidden">
        Experiencias <br />
        <span className="font-dark-twenty text-[35px] sm:text-[104px] text-pale-skin">
          Preseciales
        </span>
      </h2>

      {/* Marquee Background */}
      <div className="absolute w-full overflow-hidden top-[120px] xl:top-0">
        <Marquee className="">
          <p className="font-stretch-pro text-border text-[200px] xl:text-[300px] 2xl:text-[400px] text-black">
            Experiencia
          </p>
        </Marquee>
      </div>

      {/* Desktop Header */}
      <div className="flex-col md:flex-row items-center gap-[50px] px-4 sm:pl-[75px] xl:pl-[150px] 2xl:pl-[200px] relative z-10 hidden md:flex">
        <p className="font-stretch-pro text-[25px] xl:text-[30px] 2xl:text-[40px] leading-none 2xl:leading-[35px]">
          <span className="font-dark-twenty inline-block text-[30px] xl:text-[40px] 2xl:text-[60px] text-pale-skin">
            Vive una
          </span>
          <br />
          experiencia <br />
          <span className="font-dark-twenty text-right inline-block w-full text-[30px] xl:text-[40px] 2xl:text-[60px] text-pale-skin">
            {type}
          </span>
        </p>
        <div className="w-[1px] h-[90px] bg-pale-skin hidden md:block"></div>
        <p className="leading-[30px] font-futura h-full">
          {isDateSet ? `EN ${month}` : 'PRÓXIMAMENTE'}
          <br />
          <span className="text-[30px] xl:text-[50px] font-stretch-pro">
            {header.firstPart}
          </span>
          <span className="font-dark-twenty text-pale-skin text-[50px] xl:text-[100px] inline-block -translate-y-3 xl:-translate-y-6">
            {header.secondPart}
          </span>
        </p>
      </div>
    </>
  );
};

export default ExperienceHeader;