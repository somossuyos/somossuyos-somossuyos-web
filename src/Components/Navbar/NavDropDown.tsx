import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';
import MenuItemSVG from '../SVG/MenuItemSVG';

type NavDropDownProps = {
  label: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  options: {
    label: string;
    href: string;
  }[];
  onClick: () => void;
};

const NavDropDown = ({ label, options, isOpen, setIsOpen, onClick }: NavDropDownProps) => {

  return (
    <div
      className='relative flex flex-col items-center sm:items-start justify-center sm:justify-start xl:gap-10 font-futura text-[20px] text-black xl:px-2'
    >
      <div
        onClick={() => (setIsOpen(!isOpen))}
        className='flex items-center justify-center w-fit xl:w-auto gap-6 hover:cursor-pointer'
      >
        <p>
          {label}
        </p>
        <div
          className={`${isOpen ? '' : 'rotate-180'} transition-transform duration-500`}
        >
          <MenuItemSVG />
        </div>
      </div>
      <div className={`xl:absolute bottom-0 xl:translate-y-[110%] left-0 xl:bg-white w-full text-[16px] overflow-hidden ${isOpen ? 'h-fit' : 'h-0'}`}>
        {
          options.map((option) => (
            <Link key={option.label} href={option.href} onClick={onClick} className='inline-block w-full hover:bg-pale-skin px-4 py-4 sm:py-2 text-center sm:text-left text-black'>
              {option.label}
            </Link>
          ))
        }
      </div>
    </div>
  );
};

export default NavDropDown;