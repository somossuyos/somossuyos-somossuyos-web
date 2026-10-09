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

function loadSkillcertEnv(): void {
  if (process.env.SKILLCERT_PROVISION_KEY_ID && process.env.SKILLCERT_PROVISION_SECRET) return;
  const appId = process.env.WEB_AMPLIFY_APP_ID?.trim() || 'd38aqwoe3xhw53';
  const raw = execFileSync(
    'aws',
    ['amplify', 'get-branch', '--app-id', appId, '--branch-name', 'main', '--output', 'json'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
  );
  const ev = (JSON.parse(raw) as { branch?: { environmentVariables?: Record<string, string> } })
    .branch?.environmentVariables;
  if (ev?.SKILLCERT_PROVISION_KEY_ID) process.env.SKILLCERT_PROVISION_KEY_ID = ev.SKILLCERT_PROVISION_KEY_ID;
  if (ev?.SKILLCERT_PROVISION_SECRET) process.env.SKILLCERT_PROVISION_SECRET = ev.SKILLCERT_PROVISION_SECRET;
  if (ev?.SKILLCERT_API_URL) process.env.SKILLCERT_API_URL = ev.SKILLCERT_API_URL;
}

loadSkillcertEnv();
const result = await reconcileRenaserAccess(ref);
console.log(JSON.stringify(result));
