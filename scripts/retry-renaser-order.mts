/**
 * One-off ops: retry SkillCert provisioning for an APPROVED RenaSER order.
 * Usage: REF=ss-renaser-... npx tsx scripts/retry-renaser-order.mts
 */
import { retryRenaserProvisioning } from '../src/lib/orders/retryRenaserProvisioning';

const ref = process.env.REF?.trim();
if (!ref) {
  console.error('Set REF=ss-renaser-...');
  process.exit(1);
}

const result = await retryRenaserProvisioning(ref);
console.log(JSON.stringify(result));
