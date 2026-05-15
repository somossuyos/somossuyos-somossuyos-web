import { ExperienceRegisterDTO } from '../DTOs/Experiences/ExperienceRegisterDTO';
import { ExperienceResponse, ExperiencesResponse } from '@/src/entities/Experience';

export const experiencesRepository = {
  getExperiences: async ():Promise<ExperiencesResponse> =>{
    const response = await fetch(`${process.env.API_URL}/experiencias?fields=Fecha&fields=slug&fields=habilitar_inscripcion&fields=vendido&fields=Titulo&fields=Precio&fields=Tipo&fields=Estado&fields=categoria&populate[Miniatura][fields]=url&fields=max_inscritos&pagination[pageSize]=100&sort=Fecha:desc&filters[Estado][$ne]=Finalizado`);
    const data = await response.json();
    return data;
  },
  getExperiencesByCategory: async (category: string) => {
    const response = await fetch(`${process.env.API_URL}/experiencias?filters[categoria][$eq]=${category}&populate[expositores][populate]=foto&populate[expositores][populate]=foto_afiliacion&populate[Miniatura][fields]=url&populate[Mosaico][fields]=url`);
    const data = await response.json();
    return data;
  },
  getFinishedExperiences: async ():Promise<ExperiencesResponse> => {
    const response = await fetch(`${process.env.API_URL}/experiencias?fields=Fecha&fields=habilitar_inscripcion&fields=Titulo&fields=Precio&populate[Miniatura][fields]=url&fields=max_inscritos&fields=slug&pagination[pageSize]=100&sort=Fecha&filters[Estado][$eq]=Finalizado`);
    const data = await response.json();
    return data;
  },
  getExperiencesByTheme: async (theme: string) => {
    const response = await fetch(`${process.env.API_URL}/experiencias?fields=Fecha&fields=habilitar_inscripcion&fields=vendido&fields=Precio&fields=Titulo&populate[Miniatura][fields]=url&fields=max_inscritos&filters[Tematica][$eq]=${theme}&pagination[pageSize]=100&sort=Fecha&filters[Estado][$ne]=Finalizado`);
    const data = await response.json();
    return data;
  },
  getRelatedExperiences: async (slug: string):Promise<ExperiencesResponse> => {
    const response = await fetch(`${process.env.API_URL}/experiencias?fields=Fecha&fields=habilitar_inscripcion&fields=vendido&fields=Precio&fields=Titulo&fields=slug&populate[Miniatura][fields]=url&pagination[pageSize]=3&filters[slug][$ne]=${slug}&filters[Estado][$ne]=Finalizado`);
    const data = await response.json();
    return data;
  },
  getExperiencesIds: async () => {
    const response = await fetch(`${process.env.API_URL}/experiencias?fields=id&pagination[pageSize]=100&filters[Estado][$ne]=Finalizado`);
    const data = await response.json();
    return data;
  },
  getExperienceBySlug: async (slug: string):Promise<ExperienceResponse> =>{
    const response = await fetch(`${process.env.API_URL}/experiencias?fields=Fecha&fields=fecha_maxima_inscripcion&fields=vendido&fields=Hora&fields=habilitar_inscripcion&fields=Precio&fields=max_inscritos&fields=Titulo&fields=Descripcion&fields=Tematica&fields=Tipo&fields=Estado&fields=habilitar_donaciones&fields=adicionales&fields=terminos&fields=categoria&fields=link&fields=slug&populate[expositores][fields]=*&populate[Miniatura][fields]=url&populate[Encabezado][populate]=Titulos&populate[Actividad][fields]=*&populate[Actividad][populate]=Subactividades&populate[Mosaico][fields]=url&populate[expositores][populate][foto][fields]=url&populate[expositores][populate][foto_afiliacion][fields]=url&populate[recurso_libro][fields]=*&populate[recurso_libro][populate][Miniatura][fields]=url&filters[slug][$eq]=${slug}&pagination[pageSize]=1`);
    const data = await response.json();
    return data;
  },
  getExperienceInscriptionData: async (id: string) => {
    const response = await fetch(`${process.env.API_URL}/experiencias/${id}?fields=Titulo&fields=vendido&fields=Fecha&fields=Precio&fields=max_inscritos&fields=habilitar_inscripcion&fields=deshabilitar_por_sexo&fields=Estado`);
    const data = await response.json();
    return data;
  },
  registerExperience: async (data: ExperienceRegisterDTO) => {
    const response = await fetch(`${process.env.API_URL}/inscripciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          'Nombre': `${data.names} ${data.lastNames}`,
          'Correo': data.email,
          'Telefono': data.phone,
          'Fecha': new Date().toISOString(),
          'Experiencia': data.id
        }
      }),
    });
    return response.json();
  },
  getHomeNextExperience: async ():Promise<ExperienceResponse> => {
    const response = await fetch(`${process.env.API_URL}/experiencias?fields=Fecha&fields=Tipo&fields=slug&populate[Encabezado][populate][Titulos]=Titulos&filters[Fecha][$gt]=${new Date().toISOString()}&filters[Estado][$ne]=Finalizado&sort=Fecha&pagination[pageSize]=1`);
    const data = await response.json();
    return data;
  },
  getHomeExperiences: async ():Promise<ExperiencesResponse> => {
    const response = await fetch(`${process.env.API_URL}/experiencias?fields=Fecha&fields=vendido&fields=Titulo&fields=habilitar_inscripcion&populate[Miniatura][fields]=url&filters[Fecha][$gt]=${new Date().toISOString()}&filters[Estado][$ne]=Finalizado&sort=Fecha&pagination[pageSize]=4`);
    const data = await response.json();
    return data;
  },
  getInscriptionsCount: async () => {
    const response = await fetch(`${process.env.API_URL}/experiencias/count`);
    const data = await response.json();
    return data;
  },
  getInscriptionById: async (id: string, email: string) => {
    const response = await fetch(`${process.env.API_URL}/inscripciones?filters[Experiencia][$eq]=${id}&filters[Correo][$eq]=${email}`);
    const data = await response.json();
    return data;
  }
};