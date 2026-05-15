import WompiImage from '@/public/img/home/wompi_logo.webp';
import PaypalImage from '@/public/img/home/paypal.png';
import Image from 'next/image';

type DonationsModalProps = {
  closeModal: () => void;
}

const DonationsModal = ({closeModal}:DonationsModalProps) => {
  const handlePaypalClick = () => {
    closeModal();
  };

  const handleWompiClick = () => {
    closeModal();
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white p-8 rounded-lg text-center mx-10'>
        <p className='text-black'>Selecciona por dónde quieres hacer tu donación</p>
        <div className='flex items-center justify-center gap-4 mt-6'>
          <a
            href='https://www.paypal.me/mariapaldana'
            target='_blank'
            rel='noopener noreferrer'
            onClick={handlePaypalClick}
            className='block h-fit'
          >
            <Image
              alt='Paypal'
              src={PaypalImage}
              width={90}
              height={50}
              className='rounded'
            />
          </a>
          <a
            href='https://checkout.wompi.co/l/VPOS_cziAyf'
            target='_blank'
            rel='noopener noreferrer'
            onClick={handleWompiClick}
            className='block h-fit'
          >
            <Image
              alt='Wompi'
              src={WompiImage}
              width={105}
              height={50}
              className='rounded'
            />
          </a>
        </div>
        <div className='mt-4'>
          <button
            onClick={closeModal}
            className='bg-custom-red text-black px-4 py-2 rounded'
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationsModal;