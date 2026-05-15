import WeAreComponent from '@/src/Components/WeAre/WeAreComponent';
import { Staff } from '@/src/entities/Staff';
import { StaffsDTO } from '@/src/infrastructure/DTOs/Staffs/StafsDTO';
import { stafRepository } from '@/src/infrastructure/repositories/staf.repository';
import { weAreGalleryImages } from '@/src/utils/weAreGalleryImages';
import { GetStaticProps } from 'next';

import Head from 'next/head';
import React from 'react';

export const getStaticProps: GetStaticProps = async () => {

  const data = await stafRepository.getStaf() as StaffsDTO;
  const staff = data.data?.map((staff) => {
    const [name, lastNames] = staff.attributes.Nombre.split(',');
    return {
      name,
      lastNames,
      description: staff.attributes.Descripcion,
      shortDescription: staff.attributes.Descripcion_Corta,
      thumbnail: staff.attributes.Miniatura.data[0].attributes.url
    };
  }) ?? [];

  return {
    props: {
      staff,
      images: weAreGalleryImages
    },
    revalidate: 300
  };
};

export type NosotrosProps = {
  staff: Staff[];
  images: string[];
}

export default function Nosotros(props: NosotrosProps) {
  return <>
    <Head>
      <title>Nosotros</title>
    </Head>
    <WeAreComponent {...props} />
  </>;
}