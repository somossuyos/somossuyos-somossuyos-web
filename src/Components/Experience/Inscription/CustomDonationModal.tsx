import React from 'react';
import DonationModal from './DonationModal';

type CustomDonationModalProps = {
  porpuse: string;
  showButton: boolean;
};

const CustomDonationModal = ({ porpuse, showButton }: CustomDonationModalProps) => {
  const [showModal, setShowModal] = React.useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      {showModal && (
        <DonationModal purpose={porpuse} toggleModal={toggleModal} />
      )}
      {showButton && (
        <button
          className={
            'flex text-left w-fit sm:w-full rounded-[28px] sm:rounded-r-[0px] border-2 px-5 sm:px-10 py-3 sm:py-5 mb-5 sm:m-0 bg-black border-pale-skin sm:mt-[50px] xl:mt-[100px] sm:border-r-transparent font-stretch-pro sm:text-[20px] xl:text-[26px] 2xl:text-[32px] leading-none 2xl:leading-[34px] text-pale-skin sm:ml-4'
          }
          onClick={toggleModal}
        >
          Sin tus donaciones no podemos continuar
        </button>
      )}
    </>
  );
};

export default CustomDonationModal;
