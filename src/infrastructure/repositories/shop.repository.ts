import { CourseResponse } from '@/src/entities/Course';

export const shopRepository = {
  async getProducts() {
    const response = await fetch(`${process.env.API_URL}/productos?fields=slug&fields=Titulo&fields=createdAt&populate[categoria_productos][fields][0]=Nombre&populate[categoria_productos][fields][1]=slug&populate[categoria_productos][fields][2]=Costo_envio&populate[Miniatura][fields]=url&filters[Stock][$gt]=0&pagination[pageSize]=100&populate[Miniatura][fields]=height&fields=Precio`);
    const data = await response.json();
    return data;
  },
  async getProductBySlug(slug: string) {
    const response = await fetch(`${process.env.API_URL}/productos?fields=Genero&populate[categoria_productos][fields][0]=Nombre&populate[categoria_productos][fields][1]=Costo_envio&fields=Titulo&fields=Precio&fields=Descripcion&populate[Colores][fields]=*&populate[Tallas][fields]=*&fields=SKU&fields=Stock&populate[Fotos][fields]=url&populate[Miniatura][fields]=url&filters[slug][$eq]=${slug}`);
    const data = await response.json();
    return data;
  },
  async getCourses():Promise<CourseResponse>{
    const response = await fetch(`${process.env.API_URL}/cursos?fields=slug&fields=Titulo&fields=createdAt&populate[Miniatura][fields]=url&populate[Miniatura][fields]=height&fields=Precio`);
    const data = await response.json();
    return data;
  },
  async getCourse(slug: string) {
    const response = await fetch(`${process.env.API_URL}/cursos?fields=Titulo&fields=Precio&fields=Descripcion&fields=slug&populate[Imagenes][fields]=url&populate[Miniatura][fields]=url&populate[Miniatura][fields]=height&filters[slug][$eq]=${slug}`);
    const data = await response.json();
    return data;
  }
};