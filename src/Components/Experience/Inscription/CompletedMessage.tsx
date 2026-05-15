'use client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import DonationModal from './DonationModal';

const CompletedMessage = () => {
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <>
      {showModal && (
        <DonationModal purpose="Novena" toggleModal={toggleModal} />
      )}
      <div className="flex gap-4 flex-col items-center justify-center w-full sm:w-fit">
        <p>Inscripción registrada</p>
        <a
          href="https://whatsapp.com/channel/0029Vb8ALbbBfxnxJhSO5Z1u"
          target="_blank"
          className="bg-pale-skin text-black block self-center sm:self-start px-8 py-2 rounded-lg mt-5"
        >
          Para recibir los audios, únete al canal de whatsapp
        </a>
        <button onClick={goBack}>Volver</button>
      </div>
    </>
  );
};

export default CompletedMessage;
