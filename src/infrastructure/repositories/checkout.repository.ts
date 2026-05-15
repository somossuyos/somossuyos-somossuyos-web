import { CheckoutDTO } from '../DTOs/Checkout/CheckoutDTO';

export const checkoutRepository = {
  async checkout(data: CheckoutDTO) {
    const mappedItems = data.items.map(item => {
      const isProduct = item.type === 'producto.producto' || item.type === 'product';
      const mapped = {
        '__component': item.type,
        'Color': item.color,
        'Talla': item.size,
        'Nombre': `${data.form.names} ${data.form.lastNames}`,
        'Proposito': item.purpose,
        'experiencia': item.experience,
        'producto': isProduct ? { data: { id: item.product } } : item.product,
        'curso': item.course,
        'recurso_libro': item.book,
        'asistentes': item.asistants ?
          item.asistants?.map(asistant => ({
            'Nombre': asistant.names,
            'Apellido': asistant.lastNames,
            'Correo': asistant.email,
            'Telefono': asistant.phone,
          })) :
          item.congressAsistants?.map(asistant => ({
            'Nombres': asistant.names,
            'Edad': asistant.age,
            'Correo': asistant.email,
            'WhatsApp': asistant.phone,
            'Estado_civil': asistant.civilState
          })),
        'cantidad': isProduct ? item.quantity : (item.asistants?.length),
      };
      return mapped;
    });

    const body = JSON.stringify({
      Total: `${data.totalPrice}`,
      Fecha: new Date().toISOString(),
      Items: mappedItems,
      Cliente: {
        'Nombre': data.form.names,
        'Apellido': data.form.lastNames,
        'Correo': data.form.email,
        'Telefono': data.form.phone,
        'Direccion': {
          'Ciudad': data.form.direction?.city,
          'Pais': data.form.direction?.country,
          'Departamento': data.form.direction?.state,
          'Direccion': data.form.direction?.direction
        }
      }
    });

    const response = await fetch(`${process.env.MICROSERVICE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJyb2xlIjoiU1VQRVJfQURNSU4ifQ.epLw7nM5qresXmEL498EWMn2zLr2p_xOLiftlgPvwW4'
      },
      body
    });

    if (response.status === 500) {
      const text = response.text();
      return text;
    }
    const json = await response.json();
    return json;
  },
  async getCheckout(id: string) {
    const response = await fetch(`${process.env.API_URL}/transacciones?fields=Estado&filters[idTransaccion][$eq]=${id}`);
    const json = await response.json();
    return json;
  },
  async getDeliveryQoute(
    destinationCode: string,
    destinationAddress: string,
    value: number
  ) {
    const response = await fetch(`${process.env.MICROSERVICE_URL}/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'packages': [
          {
            'weight': 1,
            'height': 10,
            'width': 5,
            'length': 15
          }
        ],
        'description': 'Compra en Somos Suyos',
        'contentValue': value,
        'origin': {
          'daneCode': '11001000',
          'address': 'Calle 98 62-37'
        },
        'destination': {
          'daneCode': destinationCode,
          'address': destinationAddress
        }
      })
    });
    const json = await response.json();
    return json;
  }
};