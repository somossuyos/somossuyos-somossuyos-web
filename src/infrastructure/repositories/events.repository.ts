export const eventsRepository = {
  getEvents: async () => {
    const response = await fetch(`${process.env.API_URL}/eventos?fields=Titulo&fields=Ubicacion&fields=Colaboracion&fields=Dia&fields=Fecha&fields=Tipo&fields=Link&fields=Duracion&fields=Descripcion&fields=Integrantes&populate[Miniatura][fields]=url&populate[Banner][fields]=url&sort=Fecha`);
    const data = await response.json();
    return data;
  },
  getEventsIds: async () => {
    const response = await fetch(`${process.env.API_URL}/eventos?fields=id`);
    const data = await response.json();
    return data;
  },
  getEvent: async (id: string) => {
    const response = await fetch(`${process.env.API_URL}/eventos/${id}?populate[Miniatura][fields]=url&populate[Banner][fields]=url`);
    const data = await response.json();
    return data;
  },
  getHomeNextEvent: async () => {
    const response = await fetch(`${process.env.API_URL}/eventos?fields=Titulo&fields=Dia&fields=Link&fields=Ubicacion&fields=Titulo&fields=Fecha&pagination[pageSize]=6&sort=Fecha:desc&filters[Fecha][$gte]=${new Date().toISOString()}`);
    const data = await response.json();
    return data;
  }
};