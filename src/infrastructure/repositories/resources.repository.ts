export const resourcesRepository = {
  getCourses: async () => {
    const response = await fetch(`${process.env.API_URL}/cursos?fields=Titulo&populate[Miniatura][fields]=url&populate[Encabezado][fields]=Link`);
    const data = await response.json();
    return data;
  },
  getVideos: async () => {
    const response = await fetch(`${process.env.API_URL}/recurso-videos?fields=Titulo&fields=Subtitulo&fields=Link&populate[Miniatura][fields]=url`);
    const data = await response.json();
    return data;
  },
  getBlog: async () => {
    const response = await fetch(`${process.env.API_URL}/blogs?fields=Titulo&fields=Fecha&populate[Miniatura][fields]=url&pagination[pageSize]=4&sort=createdAt`);
    const data = await response.json();
    return data;
  },
  getBlogCategories: async () => {
    const response = await fetch(`${process.env.API_URL}/blog-tematicas?fields=Nombre`);
    const data = await response.json();
    return data;
  },
  getBooks: async () => {
    const response = await fetch(`${process.env.API_URL}/recurso-libros?fields=Nombre&fields=Autor&fields=Link&fields=Precio&fields=link_paypal&populate[Miniatura][fields]=url&filters[En_venta][$eq]=true`);
    const data = await response.json();
    return data;
  },
  getBookById: async (id: number) => {
    const response = await fetch(`${process.env.API_URL}/recurso-libros/${id}?fields=Nombre&fields=Autor&fields=Link&populate[Miniatura][fields]=url`);
    const data = await response.json();
    return data;
  }
};