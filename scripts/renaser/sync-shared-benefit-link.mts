/**
 * Escribe private/renaser-shared-benefit-link.txt (gitignored) desde env.
 * No imprime el token en stdout.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

function upsertEnvLocalKey(key: string, value: string): void {
  const envPath = path.join(process.cwd(), '.env.local');
  let body = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  if (re.test(body)) {
    body = body.replace(re, line);
  } else {
    body = `${body.trimEnd()}\n\n# RenaSER shared private link (do not commit)\n${line}\n`;
  }
  fs.writeFileSync(envPath, body.endsWith('\n') ? body : `${body}\n`, 'utf8');
}

loadEnvLocal();

let token = process.env.RENASER_SHARED_BENEFIT_TOKEN?.trim();
let generated = false;
if (!token || token.length < 32) {
  token = crypto.randomBytes(32).toString('base64url');
  upsertEnvLocalKey('RENASER_SHARED_BENEFIT_TOKEN', token);
  process.env.RENASER_SHARED_BENEFIT_TOKEN = token;
  generated = true;
}

let sessionSecret = process.env.RENASER_BENEFIT_SESSION_SECRET?.trim();
if (!sessionSecret || sessionSecret.length < 32) {
  sessionSecret = crypto.randomBytes(32).toString('base64url');
  upsertEnvLocalKey('RENASER_BENEFIT_SESSION_SECRET', sessionSecret);
  process.env.RENASER_BENEFIT_SESSION_SECRET = sessionSecret;
}

const base =
  process.env.NEXT_PUBLIC_BASE_URL?.trim()?.replace(/\/$/, '') ||
  'https://www.somossuyos.com';
const url = `${base}/renaser/beneficio?${new URLSearchParams({ k: token! }).toString()}`;

const outDir = path.join(process.cwd(), 'private');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'renaser-shared-benefit-link.txt');
fs.writeFileSync(
  outPath,
  `# Operational shared link for RenaSER 2026 mailing (gitignored). Do not commit.\n${url}\n`,
  'utf8',
);

console.log(
  JSON.stringify({
    ok: true,
    path: 'private/renaser-shared-benefit-link.txt',
    tokenGenerated: generated,
    tokenConfigured: true,
  }),
);
