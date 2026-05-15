import { Experience, Expositores, Actividad, Subactividade } from '@/src/entities/Experience';
import { Book } from '@/src/entities/Book';
import { ExperienceDTO, SpeakerDto, ActivityDto, SubactivityDto } from '../DTOs/Experiences/ExperienceDTO';
import { BookDTO } from '../DTOs/Books';
import { Encabezado, Titulo } from '@/src/entities/types/SharedTypes';
import { HeaderDTO, TitleDTO } from '../DTOs/Shared/HeaderDTO';

function speakerDataTransform(speaker: Expositores): SpeakerDto {
  return {
    id: speaker.id,
    names: speaker.nombres,
    affiliation: speaker.afiliacion,
    description: speaker.descripcion,
    photo: speaker.foto,
    affiliationPhoto: speaker.foto_afiliacion,
  };
}

function titleDataTransform(title: Titulo): TitleDTO {
  return {
    id: title.id,
    content: title.contenido,
  };
}

function headerDataTransform(header: Encabezado): HeaderDTO {
  return {
    id: header.id,
    titles: header.Titulos.map(titleDataTransform),
  };
}

function subactivityDataTransform(sub: Subactividade): SubactivityDto {
  return {
    id: sub.id,
    name: sub.Nombre ?? null,
  };
}

function activityDataTransform(activity: Actividad): ActivityDto {
  return {
    id: activity.id,
    title: activity.Titulo,
    quantity: activity.Cantidad,
    duration: activity.Duracion,
    subactivities: activity.Subactividades.map(subactivityDataTransform),
  };
}

function bookDataTransform(book: Book): BookDTO {
  return {
    id: book.id ?? null,
    url: book.url ?? null,
    name: book.Nombre ?? null,
    author: book.Autor ?? null,
    description: book.Descripcion ?? null,
    createdAt: book.createdAt ?? null,
    updatedAt: book.updatedAt ?? null,
    publishedAt: book.publishedAt ?? null,
    price: book.Precio ?? null,
    link: book.Link ?? null,
    onSale: book.En_venta ?? null,
    thumbnail: book.Miniatura ?? null,
    paypalLink: book.link_paypal ?? null,
  };
}

export function experienceDataTransform(experience: Experience): ExperienceDTO | null {

  if (experience) {
    return {
      id: experience.id,
      date: experience.Fecha,
      maxRegistrationDate: experience.fecha_maxima_inscripcion,
      sold: experience.vendido,
      time: experience.Hora,
      registrationEnabled: experience.habilitar_inscripcion,
      price: experience.Precio,
      maxRegistrants: experience.max_inscritos,
      disableBySex: experience.deshabilitar_por_sexo,
      title: experience.Titulo,
      description: experience.Descripcion,
      theme: experience.Tematica,
      type: experience.Tipo,
      status: experience.Estado,
      donationsEnabled: experience.habilitar_donaciones,
      additional: experience.adicionales,
      terms: experience.terminos,
      category: experience.categoria,
      link: experience.link,
      slug: experience.slug,
      speakers: experience.expositores && experience.expositores.map(speakerDataTransform),
      thumbnail: experience.Miniatura,
      header: experience.Encabezado && headerDataTransform(experience.Encabezado),
      activity: experience.Actividad ? activityDataTransform(experience.Actividad) : null,
      mosaic: experience.Mosaico,
      bookResource: experience.recurso_libro && experience.recurso_libro.data && experience.recurso_libro.data.attributes ? {
        data: {
          id: experience.recurso_libro.data.id,
          attributes: bookDataTransform(experience.recurso_libro.data.attributes),
        }
      } : undefined,
    };
  }
  return null;

}