import { resolvePaymentStatusForConfirmation } from '@/src/lib/wompi/resolvePaymentStatus';
import { clearItems } from '@/src/redux/features/cartSlice';
import { clearData } from '@/src/redux/features/checkoutSlice';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {

  const id = ctx.query.id as string;

  if (!id) {
    return {
      notFound: true
    };
  }

  const { status, source, emailSent } = await resolvePaymentStatusForConfirmation(id);

  console.info('[confirmacion-pago]', {
    id,
    status: status ?? null,
    source,
    emailSent: emailSent ?? null,
  });

  return {
    props: {
      status,
    }
  };
};

export type PaymentConfirmationProps = {
  status: string | null;
}

const Index = ({ status }: PaymentConfirmationProps) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearData());
    dispatch(clearItems());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Estado de tu pago</title>
      </Head>
      <div className='w-full min-h-screen flex flex-col items-center justify-center px-8'>
        <div className='w-full  bg-black text-white flex justify-center items-center'>
          <h1 className='text-[30px] sm:text-[50px] font-stretch-pro text-gold'>Estado de tu pago</h1>
        </div>
        <div className='w-full flex justify-center items-center flex-col gap-4'>
          {
            !status && <>
              <h2 className='text-[30px] sm:text-[50px] text-red-300'>Error</h2>
              <p>
                No se pudo procesar tu pago, por favor intenta nuevamente
              </p>
              <p>
                Para más información escríbenos a <a href="mailto:contacto@somossuyos.com" className='text-gold'>contacto@somossuyos.com</a>
              </p>
            </>
          }
          {
            status === 'APPROVED' && <>
              <h2 className='text-[30px] sm:text-[50px] text-green-300'>¡Pago aprobado!</h2>
              <p>
                Tu pago ha sido procesado con éxito
              </p>
              <p className='text-center text-sm opacity-90 max-w-md'>
                Revisa tu correo: te enviamos el enlace para descargar tu novena digital.
              </p>
            </>
          }
          {
            status === 'CANCEL' &&
            <>
              <h2 className='text-[30px] sm:text-[50px] text-red-300'>Pago rechazado</h2>
              <p>
                No se pudo procesar tu pago, por favor intenta nuevamente
              </p>
              <p>
                Si el problema persiste, por favor contacta a tu entidad financiera o al medio de pago seleccionado
              </p>
            </>
          }
          {
            status === 'DECLINED' && <>
              <h2 className='text-[30px] sm:text-[50px] text-red-300'>Pago declinado</h2>
              <p>
                No se pudo procesar tu pago, por favor intenta nuevamente
              </p>
              <p>
                Si el problema persiste, por favor contacta a tu entidad financiera o al medio de pago seleccionado
              </p>
            </>
          }
          {
            (status === 'VOIDED' || status === 'ERROR') && <>
              <h2 className='text-[30px] sm:text-[50px] text-red-300'>Pago no completado</h2>
              <p>
                No se pudo completar tu pago. Por favor intenta nuevamente o usa otro medio de pago.
              </p>
              <p>
                Para más información escríbenos a <a href="mailto:contacto@somossuyos.com" className='text-gold'>contacto@somossuyos.com</a>
              </p>
            </>
          }
          {
            status === 'PENDING' && <>
              <h2 className='text-[30px] sm:text-[50px] text-yellow-300'>Pago pendiente</h2>
              <p>
                Tu pago está pendiente de confirmación por parte de la entidad financiera o del medio de pago seleccionado,
                por favor espera unos minutos.
              </p>
            </>
          }
        </div>
      </div>
    </>
  );
};

export default Index;