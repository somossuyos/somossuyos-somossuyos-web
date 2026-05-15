import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type NavLinkProps = {
  label: string;
  href: string;
  onClick: () => void;
};

const NavLink = ({ label, href, onClick }: NavLinkProps) => {

  const router = useRouter();

  return <Link
    href={href}
    className={`font-futura text-[20px] text-black ${router.pathname === href ? 'underline underline-offset-1' : ''}`}
    onClick={onClick}
  >
    {label}
  </Link>;
};

export default NavLink;