import { ContactData } from '@/src/entities/ContactData';

export const contactRepository = {
  async sendContactForm(data: ContactData) {
    const response = await fetch(`${process.env.API_URL}/contactos?populate=*`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          Nombres: data.name,
          Apellidos: data.lastName,
          Correo: data.email,
          Mensaje: data.message,
        }
      }),
    });
    const responseData = await response.json();
    return responseData;
  },
};