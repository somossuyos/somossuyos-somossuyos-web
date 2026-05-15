export const stafRepository = {
  getStaf: async () => {
    const response = await fetch(`${process.env.API_URL}/staffs?populate[Miniatura][fields]=url&sort=id:asc`);
    const date = await response.json();
    return date;
  }
};