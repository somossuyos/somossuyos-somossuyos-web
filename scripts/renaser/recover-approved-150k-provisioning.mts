/**
 * Audit + controlled recovery for APPROVED RenaSER 150k orders (product 20260720).
 *
 *   npx tsx scripts/renaser/recover-approved-150k-provisioning.mts --dry-run
 *   npx tsx scripts/renaser/recover-approved-150k-provisioning.mts --execute
 *
 * Requires AWS credentials (e.g. AWS_PROFILE=somossuyos). Writes detail CSV to private/ (gitignored).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { DEFAULT_MEMORIAS_CONGRESO_COURSE_ID } from '../../src/lib/shop/memoriasCongresoCourse';
import type { CheckoutOrder, ProvisioningStatus } from '../../src/lib/orders/types';
import { retryRenaserProvisioning } from '../../src/lib/orders/retryRenaserProvisioning';

const ATTENDEE_AMOUNT = 15_000_000;
const PRODUCT_ID = String(DEFAULT_MEMORIAS_CONGRESO_COURSE_ID);
const ORDERS_TABLE = process.env.SOMOSSUYOS_ORDERS_TABLE_NAME?.trim() || 'SomosSuyosCheckoutOrders';
const ENTITLEMENTS_TABLE =
  process.env.RENASER_ENTITLEMENTS_TABLE_NAME?.trim() || 'RenaSEREntitlements';
const PROVISIONED_ORDERS_TABLE =
  process.env.PROVISIONED_ORDERS_TABLE_NAME?.trim() || 'RenaSERProvisionedOrders';
const COGNITO_POOL =
  process.env.COGNITO_USER_POOL_ID?.trim() || 'us-east-1_oWXdYSho7';
const REGION = process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim() || 'us-east-1';

const WEB_AMPLIFY_APP_ID = process.env.WEB_AMPLIFY_APP_ID?.trim() || 'd38aqwoe3xhw53';

const dryRun = process.argv.includes('--dry-run');
const execute = process.argv.includes('--execute');
if (!dryRun && !execute) {
  console.error('Pass --dry-run or --execute');
  process.exit(1);
}

const CONCURRENCY = Math.min(
  10,
  Math.max(1, Number(process.env.RECOVERY_CONCURRENCY?.trim() || (execute ? '3' : '4'))),
);

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});

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

function loadSkillcertProvisionEnvFromAmplify(): void {
  if (
    process.env.SKILLCERT_PROVISION_KEY_ID?.trim() &&
    process.env.SKILLCERT_PROVISION_SECRET?.trim()
  ) {
    return;
  }
  const branch = awsJson([
    'amplify',
    'get-branch',
    '--app-id',
    WEB_AMPLIFY_APP_ID,
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
  if (
    process.env.SKILLCERT_PROVISION_KEY_ID?.trim() &&
    process.env.SKILLCERT_PROVISION_SECRET?.trim()
  ) {
    return;
  }
  const app = awsJson([
    'amplify',
    'get-app',
    '--app-id',
    WEB_AMPLIFY_APP_ID,
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
  if (
    process.env.SKILLCERT_PROVISION_KEY_ID?.trim() &&
    process.env.SKILLCERT_PROVISION_SECRET?.trim()
  ) {
    return;
  }
  const aulaAppId = process.env.AULA_AMPLIFY_APP_ID?.trim() || 'd3q97jjlfbd6ph';
  const aulaBranch = awsJson([
    'amplify',
    'get-branch',
    '--app-id',
    aulaAppId,
    '--branch-name',
    'main',
    '--output',
    'json',
  ]) as { branch?: { environmentVariables?: Record<string, string> } } | null;
  const aulaEv = aulaBranch?.branch?.environmentVariables ?? {};
  if (aulaEv.SKILLCERT_PROVISION_KEY_ID?.trim()) {
    process.env.SKILLCERT_PROVISION_KEY_ID = aulaEv.SKILLCERT_PROVISION_KEY_ID.trim();
  }
  if (aulaEv.SKILLCERT_PROVISION_SECRET?.trim()) {
    process.env.SKILLCERT_PROVISION_SECRET = aulaEv.SKILLCERT_PROVISION_SECRET.trim();
  }
}

if (execute) {
  loadSkillcertProvisionEnvFromAmplify();
  if (!process.env.SKILLCERT_PROVISION_KEY_ID || !process.env.SKILLCERT_PROVISION_SECRET) {
    console.error(JSON.stringify({ ok: false, error: 'skillcert_provision_credentials_missing' }));
    process.exit(1);
  }
}

type RecoveryRow = {
  orderReference: string;
  email: string;
  amountInCents: number;
  paymentStatus: string;
  provisioningStatus: ProvisioningStatus;
  provisioningError: string;
  cognitoExists: 'YES' | 'NO' | 'UNKNOWN';
  entitlementExists: 'YES' | 'NO' | 'UNKNOWN';
  provisionedOrderExists: 'YES' | 'NO' | 'UNKNOWN';
  recoveryStatus: string;
  recoveryError: string;
};

async function scanApproved150kOrders(): Promise<CheckoutOrder[]> {
  const out: CheckoutOrder[] = [];
  let lastKey: Record<string, unknown> | undefined;
  do {
    const page = await doc.send(
      new ScanCommand({
        TableName: ORDERS_TABLE,
        ExclusiveStartKey: lastKey,
        FilterExpression:
          '#pid = :pid AND amountInCents = :amt AND #st = :approved',
        ExpressionAttributeNames: { '#pid': 'productId', '#st': 'status' },
        ExpressionAttributeValues: {
          ':pid': PRODUCT_ID,
          ':amt': ATTENDEE_AMOUNT,
          ':approved': 'APPROVED',
        },
      }),
    );
    for (const item of page.Items ?? []) {
      out.push(item as CheckoutOrder);
    }
    lastKey = page.LastEvaluatedKey;
  } while (lastKey);
  return out;
}

function cognitoSubForEmail(email: string): string | null {
  const username = email.trim().toLowerCase();
  try {
    const cu = awsJson([
      'cognito-idp',
      'admin-get-user',
      '--user-pool-id',
      COGNITO_POOL,
      '--username',
      username,
      '--output',
      'json',
    ]) as { UserAttributes?: { Name: string; Value: string }[] } | null;
    if (!cu) return null;
    const sub = cu.UserAttributes?.find((a) => a.Name === 'sub')?.Value;
    return sub ?? null;
  } catch {
    return null;
  }
}

async function cognitoExists(email: string): Promise<boolean> {
  return cognitoSubForEmail(email) !== null;
}

async function entitlementActiveForEmail(email: string): Promise<boolean> {
  const sub = cognitoSubForEmail(email);
  if (!sub) return false;
  try {
    const ent = await doc.send(
      new GetCommand({ TableName: ENTITLEMENTS_TABLE, Key: { userId: sub } }),
    );
    const item = ent.Item as { status?: string } | undefined;
    return item?.status === 'ACTIVE';
  } catch {
    return false;
  }
}

async function provisionedOrderForReference(reference: string): Promise<boolean> {
  const q = await doc.send(
    new QueryCommand({
      TableName: PROVISIONED_ORDERS_TABLE,
      IndexName: 'orderReference-index',
      KeyConditionExpression: 'orderReference = :ref',
      ExpressionAttributeValues: { ':ref': reference },
      Limit: 1,
    }),
  );
  const row = q.Items?.[0] as { status?: string } | undefined;
  return row?.status === 'COMPLETED';
}

function classify(order: CheckoutOrder): {
  bucket:
    | 'ALREADY_COMPLETED'
    | 'RECOVERABLE_INVALID_AMOUNT'
    | 'RECOVERABLE_FAILED'
    | 'PARTIAL_REQUIRES_REVIEW'
    | 'NOT_APPROVED_SKIPPED';
  recoverable: boolean;
} {
  if (order.status !== 'APPROVED') {
    return { bucket: 'NOT_APPROVED_SKIPPED', recoverable: false };
  }
  if (order.provisioningStatus === 'COMPLETED') {
    return { bucket: 'ALREADY_COMPLETED', recoverable: false };
  }
  const err = order.provisioningError?.trim() ?? '';
  if (order.provisioningStatus === 'FAILED' && err.includes('invalid_amount')) {
    return { bucket: 'RECOVERABLE_INVALID_AMOUNT', recoverable: true };
  }
  if (order.provisioningStatus === 'FAILED') {
    return { bucket: 'RECOVERABLE_FAILED', recoverable: execute };
  }
  if (
    order.provisioningStatus === 'NOT_STARTED' ||
    order.provisioningStatus === 'PROCESSING'
  ) {
    return { bucket: 'PARTIAL_REQUIRES_REVIEW', recoverable: false };
  }
  return { bucket: 'PARTIAL_REQUIRES_REVIEW', recoverable: false };
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function writeCsv(rows: RecoveryRow[], dest: string) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const header =
    'orderReference,email,amountInCents,paymentStatus,provisioningStatus,provisioningError,cognitoExists,entitlementExists,provisionedOrderExists,recoveryStatus,recoveryError';
  const lines = rows.map((r) =>
    [
      r.orderReference,
      r.email,
      String(r.amountInCents),
      r.paymentStatus,
      r.provisioningStatus,
      r.provisioningError,
      r.cognitoExists,
      r.entitlementExists,
      r.provisionedOrderExists,
      r.recoveryStatus,
      r.recoveryError,
    ]
      .map((c) => csvEscape(c))
      .join(','),
  );
  fs.writeFileSync(dest, [header, ...lines].join('\n') + '\n', 'utf8');
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.resolve(scriptDir, '../../private/renaser-150k-recovery.csv');

const orders = await scanApproved150kOrders();
const counts = {
  APPROVED_150K_FOUND: orders.length,
  ALREADY_COMPLETED: 0,
  RECOVERABLE_INVALID_AMOUNT: 0,
  RECOVERABLE_FAILED: 0,
  PARTIAL_REQUIRES_REVIEW: 0,
  NOT_APPROVED_SKIPPED: 0,
};

const rows: RecoveryRow[] = [];

for (const order of orders) {
  const { bucket, recoverable } = classify(order);
  if (bucket in counts && bucket !== 'APPROVED_150K_FOUND') {
    counts[bucket as Exclude<keyof typeof counts, 'APPROVED_150K_FOUND'>] += 1;
  }

  const [cog, ent, prov] = await Promise.all([
    cognitoExists(order.email).then((v) => (v ? 'YES' : 'NO') as RecoveryRow['cognitoExists']),
    entitlementActiveForEmail(order.email).then(
      (v) => (v ? 'YES' : 'NO') as RecoveryRow['entitlementExists'],
    ),
    provisionedOrderForReference(order.reference).then(
      (v) => (v ? 'YES' : 'NO') as RecoveryRow['provisionedOrderExists'],
    ),
  ]);

  rows.push({
    orderReference: order.reference,
    email: order.email,
    amountInCents: order.amountInCents,
    paymentStatus: order.status,
    provisioningStatus: order.provisioningStatus,
    provisioningError: order.provisioningError ?? '',
    cognitoExists: cog,
    entitlementExists: ent,
    provisionedOrderExists: prov,
    recoveryStatus: dryRun ? `DRY_RUN_${bucket}` : bucket,
    recoveryError: '',
  });

}

writeCsv(rows, csvPath);

const toRecover = orders.filter((o) => {
  const c = classify(o);
  return c.recoverable && c.bucket === 'RECOVERABLE_INVALID_AMOUNT';
});

let recovered = 0;
let recoveryFailed = 0;

if (execute && toRecover.length > 0) {
  const outcomes = await mapWithConcurrency(toRecover, CONCURRENCY, async (order) => {
    const row = rows.find((r) => r.orderReference === order.reference)!;
    const result = await retryRenaserProvisioning(order.reference);
    if (result.ok) {
      row.recoveryStatus = result.outcome === 'skipped' ? 'SKIPPED' : 'RECOVERED';
      recovered += result.outcome === 'skipped' ? 0 : 1;
    } else {
      row.recoveryStatus = 'RECOVERY_FAILED';
      row.recoveryError = result.error;
      recoveryFailed += 1;
    }
    const [cog, ent, prov] = await Promise.all([
      cognitoExists(order.email).then((v) => (v ? 'YES' : 'NO') as RecoveryRow['cognitoExists']),
      entitlementActiveForEmail(order.email).then(
        (v) => (v ? 'YES' : 'NO') as RecoveryRow['entitlementExists'],
      ),
      provisionedOrderForReference(order.reference).then(
        (v) => (v ? 'YES' : 'NO') as RecoveryRow['provisionedOrderExists'],
      ),
    ]);
    row.cognitoExists = cog;
    row.entitlementExists = ent;
    row.provisionedOrderExists = prov;
    return result;
  });
  void outcomes;
  writeCsv(rows, csvPath);
}

const aggregate = {
  TOTAL_APPROVED_150K: orders.length,
  TOTAL_COMPLETED_150K: orders.filter((o) => o.provisioningStatus === 'COMPLETED').length,
  TOTAL_FAILED_150K: orders.filter((o) => o.provisioningStatus === 'FAILED').length,
  TOTAL_INVALID_AMOUNT_150K: orders.filter((o) =>
    (o.provisioningError ?? '').includes('invalid_amount'),
  ).length,
  TOTAL_PENDING_150K: orders.filter(
    (o) => o.provisioningStatus === 'NOT_STARTED' || o.provisioningStatus === 'PROCESSING',
  ).length,
  ...counts,
  RECOVERABLE_FOR_EXECUTE: toRecover.length,
  RECOVERED_THIS_RUN: recovered,
  RECOVERY_FAILED: recoveryFailed,
  CSV_PATH: csvPath,
  MODE: dryRun ? 'dry-run' : 'execute',
};

console.log(JSON.stringify(aggregate, null, 2));
