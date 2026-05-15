import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import WhatsAppButton from '../Utils/WhatsAppButton';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return <>
    <WhatsAppButton />
    <Navbar />
    <main>
      {children}
    </main>
    <Footer />
  </>;
};

export default Layout;