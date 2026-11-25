# Camino de Santiago — pagos Wompi

## Opciones en la web

| Plan | EUR | Uso |
|------|-----|-----|
| Pago único | 1.670 | Todo el viaje |
| Cuota 1 | 460 | Vence 30 oct |
| Cuota 2–4 | 459 c/u | Nov, dic, ene |

Sección: **https://www.somossuyos.com/camino-de-santiago#pago**

## Wompi y moneda

- Wompi Colombia cobra en **COP** (centavos).
- Los **euros** son el valor acordado del programa.
- Equivalente en pesos: variable **`CAMINO_EUR_TO_COP_RATE`** (referencia **casas de cambio**, la define Somos Suyos).
- Al pagar: COP = euros del plan × ese equivalente (+ 6% si tarjeta de crédito).
- Opcional en Amplify: `CAMINO_EUR_TO_COP_RATE_AS_OF`, `CAMINO_EUR_TO_COP_RATE_LABEL` (texto en la página).

## Recargo 6% tarjeta de crédito

Wompi **no** suma porcentajes automáticos según el medio en el checkout. La web pregunta:

- **Tarjeta de crédito** → monto COP × 1,06 antes de firmar el checkout.
- **Otros medios** (PSE, débito, etc.) → sin recargo.

Quien elige tarjeta debe **pagar con tarjeta de crédito** en Wompi; el monto ya incluye el 6%.

## Variables Amplify (web)

| Variable | Ejemplo |
|----------|---------|
| `WOMPI_PUBLIC_KEY` / `WOMPI_INTEGRITY_SECRET` | Ya usados por tienda |
| `CAMINO_EUR_TO_COP_RATE` | Tasa acordada con finanzas (ej. `4500`) |
| `NEXT_PUBLIC_CAMINO_EUR_TO_COP_RATE` | Misma tasa (solo vista previa en página) |

API: `POST /api/camino-santiago/create-payment`

Referencias orden: `ss-camino-{planId}-...`

## Operación

- Cada **cuota** = un pago independiente; el usuario elige “Cuota N de 4” en la fecha correspondiente.
- Confirmación: `/confirmacion-pago` (igual que tienda).