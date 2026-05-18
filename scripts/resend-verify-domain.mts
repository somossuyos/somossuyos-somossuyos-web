/**
 * Re-verifica un dominio en Resend (comprueba DNS de nuevo).
 *
 * Uso:
 *   RESEND_API_KEY=re_xxx npx tsx scripts/resend-verify-domain.mts
 *   RESEND_API_KEY=re_xxx npx tsx scripts/resend-verify-domain.mts a93d7088-49eb-4bd7-b097-79015ef6cb9a
 *
 * La key debe tener permiso de dominios (Full access). Las keys "solo envío"
 * devuelven 401 restricted_api_key en domains.*.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Resend } from 'resend';

function loadEnvFile(filename: string) {
  try {
    const content = readFileSync(resolve(process.cwd(), filename), 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* ignore */
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

const domainId =
  process.argv[2]?.trim() || 'a93d7088-49eb-4bd7-b097-79015ef6cb9a';

const apiKey = process.env.RESEND_API_KEY?.trim();
if (!apiKey) {
  console.error('Falta RESEND_API_KEY en el entorno.');
  process.exit(1);
}

const resend = new Resend(apiKey);

console.log('Listando dominios…');
const list = await resend.domains.list();
if (list.error) {
  console.error('domains.list error:', list.error);
  console.error(
    '\nSi dice "restricted_api_key", crea en resend.com/api-keys una key con Full access.',
  );
  process.exit(1);
}

for (const d of list.data?.data ?? []) {
  console.log(`  - ${d.name} | id=${d.id} | status=${d.status}`);
}

console.log(`\nVerificando dominio id=${domainId}…`);
const result = await resend.domains.verify(domainId);

if (result.error) {
  console.error('domains.verify error:', result.error);
  process.exit(1);
}

console.log('verify OK:', result.data);
console.log('\nEspera 1–5 min y revisa en Resend → Domains que el estado sea "verified".');
console.log('Para enviar correos usa la API key de la MISMA cuenta (puede ser send-only).');
