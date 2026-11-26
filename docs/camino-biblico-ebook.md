# Camino Bíblico — e-book digital

## Página pública

- `/camino-biblico`
- `/tienda/curso/camino-biblico-de-adviento`

## Pago Wompi (Colombia)

- Precio fijo: **25.000 COP** (`CAMINO_BIBLICO_PRICE_COP`).
- API: `POST /api/camino-biblico/create-payment`
- Referencia: `ss-camino-biblico-…`

## Entrega automática del PDF

Cuando Wompi marca el pago **APPROVED**, el webhook (o `/confirmacion-pago`) envía correo con Resend.

1. **Con PDF listo:** define en Amplify:

   `CAMINO_BIBLICO_DIGITAL_PDF_URL=https://...tu-archivo.pdf`

   También puedes subir el archivo a `public/ebooks/camino-biblico-adviento.pdf` y dejar
   `NEXT_PUBLIC_BASE_URL`; si no hay URL explícita, el enlace por defecto es
   `{BASE_URL}/ebooks/camino-biblico-adviento.pdf`.

2. **Sin PDF aún:** el correo confirma la compra y dice que el e-book llegará en las próximas horas.

Cuando tengas el archivo final, súbelo a S3 (como la novena) y pon la URL en `CAMINO_BIBLICO_DIGITAL_PDF_URL`.

## Imagen

- `public/images/camino_biblico.jpeg`