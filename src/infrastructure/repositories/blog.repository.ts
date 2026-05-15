export const blogRepository = {
  async getBlogs(page: number, category: string) {
    const baseUrl = `${process.env.API_URL}/blogs?fields=Titulo&fields=slug&fields=Fecha&populate[Miniatura][fields]=url&pagination[pageSize]=8&pagination[page]=${page}`;
    const url = category.length > 0
      ? `${baseUrl}&filters[Tematica][Nombre][$eq]=${encodeURIComponent(category)}`
      : baseUrl;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  },
  async getArticles() {
    const response = await fetch(`${process.env.API_URL}/blogs?fields=slug&pagination[pageSize]=100`);
    const data = await response.json();
    return data;
  },
  async getArticleBySlug(slug: string) {
    const response = await fetch(`${process.env.API_URL}/blogs?fields=Titulo&fields=slug&populate[Tematica][fields]=Nombre&populate[Seccion][fields]=*&populate[Seccion][populate][Media][fields]=url&populate[Seccion][populate][Media][fields]=width&populate[Seccion][populate][Media][fields]=height&filters[slug][$eq]=${slug}`);
    const data = await response.json();
    return data;
  },
  async getRecommendedArticles(slug: string) {
    const response = await fetch(`${process.env.API_URL}/blogs?fields=Titulo&fields=Fecha&fields=slug&populate[Miniatura][fields]=url&filters[slug][$ne]=${slug}&pagination[pageSize]=3`);
    const data = await response.json();
    return data;
  }
};