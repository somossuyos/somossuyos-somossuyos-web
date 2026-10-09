/**
 * Idempotent aula re-provision for APPROVED RenaSER (same orderReference, no new Wompi charge).
 * Usage: REF=ss-renaser-... AWS_PROFILE=somossuyos npx tsx scripts/renaser/reconcile-order-access.mts
 */
import { execFileSync } from 'node:child_process';
import { reconcileRenaserAccess } from '../../src/lib/orders/retryRenaserProvisioning';

const ref = process.env.REF?.trim();
if (!ref) {
  console.error('Set REF=ss-renaser-...');
  process.exit(1);
}

const WEB_AMPLIFY_APP_ID = process.env.WEB_AMPLIFY_APP_ID?.trim() || 'd38aqwoe3xhw53';
const AULA_AMPLIFY_APP_ID = process.env.AULA_AMPLIFY_APP_ID?.trim() || 'd3q97jjlfbd6ph';
const REGION = process.env.AWS_REGION?.trim() || 'us-east-1';

function awsJson(args: string[]): unknown | null {
  try {
    const out = execFileSync('aws', args, {
      encoding: 'utf8',
      env: { ...process.env, AWS_REGION: REGION },
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return JSON.parse(out) as unknown;
  } catch {
    return null;
  }
}

function mergeAmplifyEnv(appId: string): void {
  const branch = awsJson([
    'amplify',
    'get-branch',
    '--app-id',
    appId,
    '--branch-name',
    'main',
    '--output',
    'json',
  ]) as { branch?: { environmentVariables?: Record<string, string> } } | null;
  const ev = branch?.branch?.environmentVariables ?? {};
  if (ev.SKILLCERT_PROVISION_KEY_ID?.trim()) {
    process.env.SKILLCERT_PROVISION_KEY_ID = ev.SKILLCERT_PROVISION_KEY_ID.trim();
  }
  if (ev.SKILLCERT_PROVISION_SECRET?.trim()) {
    process.env.SKILLCERT_PROVISION_SECRET = ev.SKILLCERT_PROVISION_SECRET.trim();
  }
  if (ev.SKILLCERT_API_URL?.trim()) {
    process.env.SKILLCERT_API_URL = ev.SKILLCERT_API_URL.trim();
  }
  const app = awsJson([
    'amplify',
    'get-app',
    '--app-id',
    appId,
    '--output',
    'json',
  ]) as { app?: { environmentVariables?: Record<string, string> } } | null;
  const appEv = app?.app?.environmentVariables ?? {};
  if (appEv.SKILLCERT_PROVISION_KEY_ID?.trim()) {
    process.env.SKILLCERT_PROVISION_KEY_ID = appEv.SKILLCERT_PROVISION_KEY_ID.trim();
  }
  if (appEv.SKILLCERT_PROVISION_SECRET?.trim()) {
    process.env.SKILLCERT_PROVISION_SECRET = appEv.SKILLCERT_PROVISION_SECRET.trim();
  }
  if (!process.env.SKILLCERT_API_URL?.trim() && appEv.SKILLCERT_API_URL?.trim()) {
    process.env.SKILLCERT_API_URL = appEv.SKILLCERT_API_URL.trim();
  }
}

if (!process.env.SKILLCERT_PROVISION_KEY_ID?.trim()) {
  mergeAmplifyEnv(WEB_AMPLIFY_APP_ID);
}
if (!process.env.SKILLCERT_PROVISION_KEY_ID?.trim()) {
  mergeAmplifyEnv(AULA_AMPLIFY_APP_ID);
}
if (!process.env.SKILLCERT_API_URL?.trim()) {
  process.env.SKILLCERT_API_URL = 'https://skillcertacademy.somossuyos.com';
}

if (!process.env.SKILLCERT_PROVISION_KEY_ID || !process.env.SKILLCERT_PROVISION_SECRET) {
  console.error(JSON.stringify({ ok: false, error: 'skillcert_provision_credentials_missing' }));
  process.exit(1);
}

const result = await reconcileRenaserAccess(ref);
console.log(JSON.stringify(result));
