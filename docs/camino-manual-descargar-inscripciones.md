# Camino de Santiago — manual rápido (ver y descargar inscripciones)

**Dónde están los datos:** Strapi (CMS), no en la web.  
**URL:** https://cms.somossuyos.com/admin  
**Usuario:** el que les dio Somos Suyos (admin o encargado Camino).

---

## 1. Ver una inscripción (lista y detalle)

1. Entra a **https://cms.somossuyos.com/admin** e inicia sesión.
2. Menú izquierdo → **Content Manager**.
3. **Collection Types** → **Camino Santiago Inscripcion**.
4. Ves la **lista** (nombre, documento, etc.). Clic en una fila para ver **todos los campos**.

Cada persona que envía el formulario en  
https://www.somossuyos.com/camino-de-santiago#registro  
aparece aquí como una fila nueva.

---

## 2. Descargar todo en Excel

1. Mismo login en el admin.
2. Menú izquierdo → **Excel Export** (plugin).
3. En **Collection Type** elige **Camino Santiago Inscripcion**.
4. Clic en **Download** (botón azul).

Se baja un archivo `.xlsx` con las columnas del formulario (nombre, correo, teléfono, edad, pasaporte, etc.).

**Si sale “no records” pero en Content Manager sí hay datos:** espera a que termine el último deploy del CMS o avisa a soporte (configuración del export).

---

## 3. Rutina sugerida

| Cuándo | Qué hacer |
|--------|-----------|
| Diario / cada pocos días | Content Manager → revisar entradas nuevas |
| Reporte para logística | Excel Export → Download → abrir en Excel o Google Sheets |
| Datos de prueba | Borrar en Content Manager → **Delete this entry** |

---

## 4. Lo que NO hace falta

- No se descarga desde la página pública.
- No uses el token de la web; solo login normal en el admin.
- El formulario **no confirma cupo**; es manifestación de interés hasta que el equipo contacte.

---

## 5. Problemas frecuentes

| Problema | Solución |
|----------|----------|
| No veo la colección Camino | Pide permisos al administrador de Strapi |
| Excel vacío | Content Manager primero; si hay filas y Excel no, redesplegar CMS o contactar soporte |
| Olvidé contraseña | Recuperar desde login Strapi o pedir reset al admin |

---

**Resumen en una línea:** `admin` → **Content Manager** (ver) o **Excel Export** (descargar) → **Camino Santiago Inscripcion**.