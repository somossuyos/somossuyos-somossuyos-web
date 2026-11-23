# Borrador — Tratamiento de datos (Camino de Santiago)

> **BORRADOR PARA REVISIÓN INTERNA.** No es política publicada ni sustituye asesoría jurídica. No enlazar desde el sitio hasta aprobación del responsable de Somos Suyos.

## 1. Responsable

Somos Suyos (identificar NIT / razón social y contacto de privacidad cuando el responsable confirme).

## 2. Finalidad

- Gestionar **preinscripciones / manifestación de interés** en la experiencia Camino de Santiago.
- Contactar a personas interesadas para información logística, pastoral y comercial del viaje.
- Evaluar requisitos de edad (18–45 años) y pasaporte vigente para planificación del grupo.
- No constituye confirmación de cupo, reserva ni contrato de viaje hasta comunicación explícita posterior.

## 3. Datos recopilados y necesidad

| Dato | ¿Necesario? | Motivo |
|------|-------------|--------|
| Nombre completo | Sí | Identificación y comunicación |
| Tipo y número de documento | **Revisar con jurídico** | Identificación ante agencia de viajes / aseguradora / fronteras si aplica |
| Fecha de nacimiento y edad | Sí (rango 18–45) | Requisito del programa; edad calculada en servidor |
| Sexo | **Revisar** | Logística de alojamiento / grupo; evaluar si puede ser opcional o agregado |
| Nacionalidad, ciudad y país de residencia | Sí | Logística, visados, contacto |
| Profesión | **Revisar** | ¿Perfil del grupo o puede omitirse o hacerse opcional? |
| Estado civil | **Revisar** | ¿Aporta valor operativo o es prescindible? |
| Correo y teléfonos | Sí | Contacto del encargado |
| Pasaporte vigente (Sí/No) | Sí | Requisito de viaje internacional |
| Aceptación y fechas de aceptación | Sí | Evidencia de consentimiento |
| Metadatos técnicos mínimos del envío | Sí | Anti-spam (honeypot, tiempo de formulario); sin perfilado publicitario |

## 4. Base legal (Colombia)

A completar con asesoría (habitualmente **autorización del titular** para datos no obligatorios y **ejecución de medidas precontractuales** cuando aplique).

## 5. Acceso y destinatarios

- **Encargado Camino de Santiago** (rol Strapi): lectura y exportación para gestión del programa.
- **Administradores CMS** autorizados de Somos Suyos.
- **Proveedores**: Supabase (PostgreSQL), AWS (hosting CMS/medios), Amplify (web). Sin venta de datos a terceros.

## 6. Conservación

- Mientras dure la gestión de la convocatoria Camino y plazos legales/tributarios que el responsable defina.
- Tras cierre del programa: anonimizar o eliminar según política general de Somos Suyos (definir plazo, p. ej. 24 meses desde último contacto).

## 7. Derechos del titular

Consulta, actualización, rectificación, supresión y revocatoria: canal **`contacto@updates.somossuyos.com`** (o el que defina el responsable), indicando asunto “Camino de Santiago — datos personales”.

## 8. Publicación en web

Tras aprobación:

1. Publicar texto oficial en URL estable (p. ej. `/legal/tratamiento-datos-camino` o PDF en dominio propio).
2. Configurar `NEXT_PUBLIC_CAMINO_PRIVACY_POLICY_URL` en Amplify y `.env.local`.
3. No usar la página de Contacto como sustituto.