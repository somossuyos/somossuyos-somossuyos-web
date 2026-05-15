export const congressRepository = {
  getCongressInscriptionCount: async () => {
    const response = await fetch(`${process.env.API_URL}/preinscripciones-renacer`);
    const data = await response.json();
    return data;
  }
};