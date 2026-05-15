import ScheduleConferenceComponent from '@/src/Components/ScheduleConference/ScheduleConferenceComponent';
import Head from 'next/head';
import React from 'react';

const AgendarConferencia = () => {
  return <>
    <Head>
      <title>Agendar conferencia</title>
    </Head>
    <ScheduleConferenceComponent />
  </>;
};

export default AgendarConferencia;