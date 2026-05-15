import React from 'react';

type FooterPhraseProps = {
  id: string;
  label: string;
}

const FooterPhrase = ({ id, label }: FooterPhraseProps) => {
  return (
    <div
      className='w-fit h-fit text-[15px] xl:text-[24px] text-black px-5 xl:px-10 py-3 xl:py-6 bg-pale-skin'
      id={id}
      style={{
        right: 0,
        pointerEvents: 'none',
        transform: 'translateY(-100%)'
      }}
    >
      <p className='pointer-events-none text-nowrap font-stretch-pro'>{label}</p>
    </div>
  );
};

export default FooterPhrase;