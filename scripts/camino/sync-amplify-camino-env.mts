/**
 * Sync Camino env vars from .env.local to Amplify app (never prints secrets).
 * Requires: aws CLI + active session (aws login / SSO profile somossuyos).
 *
 * Usage: npx tsx scripts/camino/sync-amplify-camino-env.mts [--redeploy]
 */
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const APP_ID = process.env.WEB_AMPLIFY_APP_ID?.trim() || 'd38aqwoe3xhw53';
const REGION = process.env.AWS_REGION?.trim() || 'us-east-1';

const KEYS = [
  'API_URL',
  'STRAPI_CAMINO_API_TOKEN',
  'NEXT_PUBLIC_CAMINO_INSCRIPTIONS_ENABLED',
  'NEXT_PUBLIC_CAMINO_WHATSAPP_GROUP_URL',
  'NEXT_PUBLIC_CAMINO_PRIVACY_POLICY_URL',
  'NEXT_PUBLIC_CAMINO_PAYMENT_URL',
  'NEXT_PUBLIC_BASE_URL',
] as const;

function loadEnvLocal(): Record<string, string> {
  const envPath = path.join(process.cwd(), '.env.local');
  const out: Record<string, string> = {};
  if (!fs.existsSync(envPath)) return out;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function awsJson(args: string[]): unknown {
  const env = {
    ...process.env,
    AWS_PROFILE: process.env.AWS_PROFILE || 'somossuyos',
    AWS_REGION: REGION,
    AWS_PAGER: '',
  };
  const out = execFileSync('aws', args, { encoding: 'utf8', env });
  return JSON.parse(out);
}

function fingerprint(value: string): string {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex').slice(0, 12);
}

const redeploy = process.argv.includes('--redeploy');
const local = loadEnvLocal();

const required: (typeof KEYS)[number][] = ['API_URL', 'STRAPI_CAMINO_API_TOKEN'];
for (const key of required) {
  if (!local[key]?.trim()) {
    console.log(JSON.stringify({ ok: false, error: `missing_local_${key}` }));
    process.exit(1);
  }
}

const defaults: Partial<Record<(typeof KEYS)[number], string>> = {
  NEXT_PUBLIC_CAMINO_INSCRIPTIONS_ENABLED: 'true',
  NEXT_PUBLIC_CAMINO_WHATSAPP_GROUP_URL: 'https://chat.whatsapp.com/LZtFDpH4ype95N0tt0DJ6k',
  NEXT_PUBLIC_BASE_URL: 'https://www.somossuyos.com',
};

const desired: Record<string, string> = {};
for (const key of KEYS) {
  const val = local[key]?.trim() || defaults[key as keyof typeof defaults]?.trim() || '';
  if (val) desired[key] = val;
}

const app = awsJson(['amplify', 'get-app', '--app-id', APP_ID, '--region', REGION]) as {
  app: { defaultDomain?: string; environmentVariables?: Record<string, string> };
};
const remote = { ...(app.app.environmentVariables ?? {}) };

const updatedKeys: string[] = [];
for (const [key, val] of Object.entries(desired)) {
  if ((remote[key] ?? '') !== val) updatedKeys.push(key);
}

const merged = { ...remote, ...desired };

if (updatedKeys.length === 0) {
  console.log(
    JSON.stringify({
      ok: true,
      action: 'noop',
      appId: APP_ID,
      keysChecked: Object.keys(desired),
    }),
  );
} else {
  awsJson([
    'amplify',
    'update-app',
    '--app-id',
    APP_ID,
    '--region',
    REGION,
    '--environment-variables',
    JSON.stringify(merged),
  ]);
  console.log(
    JSON.stringify({
      ok: true,
      action: 'updated',
      appId: APP_ID,
      updatedKeys,
      fingerprints: Object.fromEntries(
        updatedKeys.map((k) => [k, fingerprint(desired[k] ?? remote[k] ?? '')]),
      ),
    }),
  );
}

if (redeploy) {
  const branches = awsJson(['amplify', 'list-branches', '--app-id', APP_ID, '--region', REGION]) as {
    branches?: { branchName: string }[];
  };
  const branch = branches.branches?.find((b) => b.branchName === 'main')?.branchName ?? 'main';
  const job = awsJson([
    'amplify',
    'start-job',
    '--app-id',
    APP_ID,
    '--region',
    REGION,
    '--branch-name',
    branch,
    '--job-type',
    'RELEASE',
  ]) as { jobSummary?: { jobId?: string; status?: string } };
  console.log(JSON.stringify({ ok: true, action: 'redeploy_started', branch, job: job.jobSummary }));
}