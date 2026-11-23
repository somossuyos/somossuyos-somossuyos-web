#!/usr/bin/env npx tsx
/**
 * Verificación Camino ↔ Strapi (requiere .env.local).
 * No imprime el token. Uso: npx tsx scripts/camino/verify-integration.mts
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnvLocal() {
  const path = resolve(process.cwd(), '.env.local');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    const [, key, raw] = m;
    const val = raw.replace(/^"|"$/g, '').trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnvLocal();

const apiUrl = process.env.API_URL?.replace(/\/$/, '');
const token = process.env.STRAPI_CAMINO_API_TOKEN?.trim();

if (!apiUrl || !token) {
  console.error('BLOCKED: faltan API_URL o STRAPI_CAMINO_API_TOKEN en .env.local');
  process.exit(1);
}

const collection = 'camino-santiago-inscripciones';
const base = `${apiUrl}/${collection}`;
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

const ficticio = {
  data: {
    nombre_completo: 'Prueba Integracion Ficticia',
    tipo_documento: 'CC',
    numero_documento: `FICT-${Date.now().toString(36).toUpperCase()}`,
    fecha_nacimiento: '1995-06-15',
    edad: 30,
    sexo: 'Mujer',
    nacionalidad: 'Colombia',
    ciudad_residencia: 'Bogota',
    pais_residencia: 'Colombia',
    profesion: 'Tester',
    estado_civil: 'Soltero',
    correo: 'ficticio.camino.integration@example.invalid',
    telefono_movil: '+57 3001112233',
    pasaporte_vigente: 'Si',
    acepto_datos: true,
    fecha_inscripcion: new Date().toISOString(),
    fecha_aceptacion_politica: new Date().toISOString(),
    estado_inscripcion: 'RECIBIDA',
  },
};

async function probe(method: string, url: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: body ? headers : { Authorization: headers.Authorization },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.status;
}

async function main() {
  const findStatus = await probe('GET', base);
  const findOneStatus = await probe('GET', `${base}/1`);
  const createStatus = await probe('POST', base, ficticio);
  const updateStatus = await probe('PUT', `${base}/1`, ficticio);
  const deleteStatus = await probe('DELETE', `${base}/1`);

  console.log('token_configured=yes');
  console.log(`perm_probe GET_list=${findStatus} (expect 403)`);
  console.log(`perm_probe GET_one=${findOneStatus} (expect 403/404)`);
  console.log(`perm_probe POST_create=${createStatus} (expect 200/201)`);
  console.log(`perm_probe PUT_update=${updateStatus} (expect 403)`);
  console.log(`perm_probe DELETE=${deleteStatus} (expect 403)`);

  const pass =
    createStatus >= 200 &&
    createStatus < 300 &&
    findStatus === 403 &&
    updateStatus === 403 &&
    deleteStatus === 403;

  if (!pass) {
    console.log('integration_result=FAIL');
    process.exit(2);
  }
  console.log('integration_result=PASS');
}

main().catch((e) => {
  console.error('integration_error=', (e as Error).message);
  process.exit(3);
});