# Strapi — colección `camino-santiago-inscripciones`

**Estado verificado (2026):** `GET https://cms.somossuyos.com/api/camino-santiago-inscripciones` responde **404 Not Found**. La colección **aún no existe**; el frontend y la API route de Next.js están listos, pero **no habrá persistencia** hasta completar esta configuración.

**CMS:** https://cms.somossuyos.com (Strapi, header `x-powered-by: Strapi`).

## 1. Crear el Content-Type

En **Content-Type Builder** → **Create new collection type**:

- **Display name:** Camino Santiago Inscripciones
- **API ID (singular):** `camino-santiago-inscripcion`
- **API ID (plural):** `camino-santiago-inscripciones`

### Campos (tipo → nombre API)

| Etiqueta (admin) | Tipo | Nombre atributo | Notas |
|------------------|------|-----------------|--------|
| Nombre completo | Text (short) | `nombre_completo` | requerido |
| Tipo documento | Enumeration | `tipo_documento` | CC, CE, Pasaporte, TI, Otro |
| Número documento | Text (short) | `numero_documento` | requerido; marcar **private** en admin si está disponible |
| Fecha nacimiento | Date | `fecha_nacimiento` | requerido |
| Edad | Integer | `edad` | requerido (la envía Next) |
| Sexo | Enumeration | `sexo` | Hombre, Mujer |
| Nacionalidad | Text | `nacionalidad` | |
| Ciudad residencia | Text | `ciudad_residencia` | |
| País residencia | Text | `pais_residencia` | |
| Profesión | Text | `profesion` | |
| Estado civil | Enumeration | `estado_civil` | Soltero, Casado, Divorcido, Union libre, Consagrado, Sacerdote, Viudo |
| Correo | Email | `correo` | |
| Teléfono móvil | Text | `telefono_movil` | |
| Teléfono alternativo | Text | `telefono_alternativo` | opcional |
| Pasaporte vigente | Enumeration | `pasaporte_vigente` | Si, No |
| Aceptó datos | Boolean | `acepto_datos` | |
| Fecha inscripción | DateTime | `fecha_inscripcion` | requerido |

Guardar y **reiniciar Strapi** si aplica.

## 2. Permisos (Settings → Users & Permissions → Roles)

### Public

- **camino-santiago-inscripcion:** desmarcar `find`, `findOne`, `create`, `update`, `delete`.

### Authenticated (solo si aplica otro rol)

- Sin acceso público a listados.

### API Token (servidor Next.js)

1. **Settings → API Tokens → Create new API Token**
2. Nombre: `somossuyos-web-camino-create`
3. Token type: **Custom**
4. Permisos: solo **`create`** en `camino-santiago-inscripcion`
5. Copiar el token a Amplify / `.env.local` como **`STRAPI_CAMINO_API_TOKEN`** (nunca en el cliente ni en git).

### Admin (encargado)

- Usuario con rol **Super Admin** o rol personalizado con `find` + `findOne` sobre la colección (sin exponer token al público).

## 3. Variables en Amplify (app web `d38aqwoe3xhw53`)

| Variable | Uso |
|----------|-----|
| `API_URL` | Ya existe (ej. `https://cms.somossuyos.com/api`) |
| `STRAPI_CAMINO_API_TOKEN` | Bearer solo servidor para `POST` |

`amplify.yml` ya incluye el grep de `STRAPI_CAMINO_API_TOKEN` hacia `.env.production`.

## 4. Exportación CSV para el encargado

Strapi **no trae export CSV nativo** en todas las versiones. Opciones recomendadas (sin nuevo dashboard en Next):

1. **Plugin** [strapi-plugin-import-export-entries](https://github.com/Baboo7/strapi-plugin-import-export-entries) (Strapi v4): instalar en el proyecto backend del CMS, exportar desde Content Manager → Export (UTF-8; activar BOM en Excel si el plugin lo permite).
2. **Export manual:** Content Manager → seleccionar entradas → copiar/pegar o usar plugin.
3. **CSV seguro para Excel:** al exportar, prefijar celdas que empiezan por `=`, `+`, `-`, `@` con apóstrofe o tab; el plugin suele ofrecer “sanitized export”; si no, el encargado abre con “Datos → Desde texto/CSV” en Excel.

No se implementó endpoint público de listado/descarga en Next.js (requerimiento de seguridad).

## 5. Pruebas funcionales (obligatorias tras crear la colección)

1. `POST` con token desde Next (`/api/camino-santiago/inscripcion`) → entrada visible en admin.
2. Sin token / rol Public `create` → no debe poder crear desde el navegador directo a Strapi.
3. Usuario encargado inicia sesión en `/admin` → ve la colección.
4. Export CSV con acentos (ej. nombre con ñ, tildes).

## 6. Encabezados sugeridos CSV (español)

Nombre completo, Tipo documento, Número documento, Fecha nacimiento, Edad, Sexo, Nacionalidad, Ciudad residencia, País residencia, Profesión, Estado civil, Correo, Teléfono móvil, Teléfono alternativo, Pasaporte vigente, Aceptó datos, Fecha inscripción