# Strapi — colección `camino-santiago-inscripciones`

**Repositorio backend:** https://github.com/somossuyos/somossuyos-cms (rama `feature/camino-santiago-inscripciones` con el content-type en código).

**Estado producción (hasta desplegar CMS):** `GET https://cms.somossuyos.com/api/camino-santiago-inscripciones` responde **404**. Tras merge y deploy del CMS, debe responder **403** (Public sin acceso) o **401** sin token.

**Operación detallada:** ver `somossuyos-cms/docs/camino-santiago-inscripciones-operacion.md`.

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
| Fecha aceptación política | DateTime | `fecha_aceptacion_politica` | requerido |
| Estado inscripción | Enumeration | `estado_inscripcion` | RECIBIDA (default), EN_REVISION, CONTACTADA, CERRADA |

En el repo CMS esto ya está versionado en `src/api/camino-santiago-inscripcion/.../schema.json` — no recrear a mano salvo hotfix.

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

## 4. Exportación CSV / Excel para el encargado

El CMS ya incluye **`strapi-plugin-excel-export-2024`**. Tras deploy, la colección está registrada en `config/excel.ts`.

1. Login en https://cms.somossuyos.com/admin
2. Content Manager → **Camino Santiago Inscripcion**
3. Exportar vía el plugin (igual que inscripciones de eventos)

No hay endpoint público de descarga en Next.js.

## 5. Pruebas funcionales (obligatorias tras crear la colección)

1. `POST` con token desde Next (`/api/camino-santiago/inscripcion`) → entrada visible en admin.
2. Sin token / rol Public `create` → no debe poder crear desde el navegador directo a Strapi.
3. Usuario encargado inicia sesión en `/admin` → ve la colección.
4. Export CSV con acentos (ej. nombre con ñ, tildes).

## 6. Encabezados sugeridos CSV (español)

Nombre completo, Tipo documento, Número documento, Fecha nacimiento, Edad, Sexo, Nacionalidad, Ciudad residencia, País residencia, Profesión, Estado civil, Correo, Teléfono móvil, Teléfono alternativo, Pasaporte vigente, Aceptó datos, Fecha inscripción