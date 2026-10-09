/**
 * Operational report: APPROVED RenaSER checkout orders without ACTIVE entitlement.
 *   AWS_PROFILE=somossuyos npx tsx scripts/renaser/report-approved-without-entitlement.mts
 *   ... --write-csv   (private/renaser-250k-access-audit.csv + full audit detail)
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
import type { CheckoutOrder } from '../../src/lib/orders/types';
import { isActiveRenaserEntitlement } from '../../src/lib/orders/renaserAccessAudit';
const PRODUCT_ID = String(DEFAULT_MEMORIAS_CONGRESO_COURSE_ID);
const ORDERS_TABLE = process.env.SOMOSSUYOS_ORDERS_TABLE_NAME?.trim() || 'SomosSuyosCheckoutOrders';
const ENTITLEMENTS_TABLE =
  process.env.RENASER_ENTITLEMENTS_TABLE_NAME?.trim() || 'RenaSEREntitlements';
const PROVISIONED_ORDERS_TABLE =
  process.env.PROVISIONED_ORDERS_TABLE_NAME?.trim() || 'RenaSERProvisionedOrders';
const COGNITO_POOL =
  process.env.COGNITO_USER_POOL_ID?.trim() || 'us-east-1_oWXdYSho7';
const REGION = process.env.AWS_REGION?.trim() || 'us-east-1';

const writeCsv = process.argv.includes('--write-csv');
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const csv250Path = path.resolve(scriptDir, '../../private/renaser-250k-access-audit.csv');

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});

function cognitoSub(email: string): string | null {
  try {
    const out = execFileSync(
      'aws',
      [
        'cognito-idp',
        'admin-get-user',
        '--user-pool-id',
        COGNITO_POOL,
        '--username',
        email.trim().toLowerCase(),
        '--output',
        'json',
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    const parsed = JSON.parse(out) as { UserAttributes?: { Name: string; Value: string }[] };
    return parsed.UserAttributes?.find((a) => a.Name === 'sub')?.Value ?? null;
  } catch {
    return null;
  }
}

async function entitlementByUserId(userId: string): Promise<{ status: string; productId: string } | null> {
  const ent = await doc.send(
    new GetCommand({ TableName: ENTITLEMENTS_TABLE, Key: { userId } }),
  );
  const item = ent.Item as { status?: string; productId?: string } | undefined;
  if (!item?.status) return null;
  return { status: item.status, productId: item.productId ?? '' };
}

async function entitlementByOrderReference(
  orderReference: string,
): Promise<{ status: string; productId: string; userId: string } | null> {
  const page = await doc.send(
    new ScanCommand({
      TableName: ENTITLEMENTS_TABLE,
      FilterExpression: 'orderReference = :ref',
      ExpressionAttributeValues: { ':ref': orderReference },
    }),
  );
  const item = page.Items?.[0] as
    | { status?: string; productId?: string; userId?: string }
    | undefined;
  if (!item?.status || !item.userId) return null;
  return {
    status: item.status,
    productId: item.productId ?? '',
    userId: item.userId,
  };
}

async function hasActiveRenaserEntitlement(order: CheckoutOrder): Promise<boolean> {
  const sub = cognitoSub(order.email);
  if (sub) {
    const byUser = await entitlementByUserId(sub);
    if (isActiveRenaserEntitlement(byUser)) return true;
  }
  const byRef = await entitlementByOrderReference(order.reference);
  return isActiveRenaserEntitlement(byRef);
}

async function provisionedOrderSummary(orderReference: string): Promise<{
  exists: boolean;
  status: string;
  notificationStatus: string;
}> {
  const q = await doc.send(
    new QueryCommand({
      TableName: PROVISIONED_ORDERS_TABLE,
      IndexName: 'orderReference-index',
      KeyConditionExpression: 'orderReference = :ref',
      ExpressionAttributeValues: { ':ref': orderReference },
      Limit: 1,
    }),
  );
  const row = q.Items?.[0] as
    | { status?: string; notificationStatus?: string }
    | undefined;
  if (!row) return { exists: false, status: '', notificationStatus: '' };
  return {
    exists: true,
    status: row.status ?? '',
    notificationStatus: row.notificationStatus ?? '',
  };
}

async function scanApprovedRenaser(): Promise<CheckoutOrder[]> {
  const out: CheckoutOrder[] = [];
  let lastKey: Record<string, unknown> | undefined;
  do {
    const page = await doc.send(
      new ScanCommand({
        TableName: ORDERS_TABLE,
        ExclusiveStartKey: lastKey,
        FilterExpression: '#pid = :pid AND #st = :approved',
        ExpressionAttributeNames: { '#pid': 'productId', '#st': 'status' },
        ExpressionAttributeValues: { ':pid': PRODUCT_ID, ':approved': 'APPROVED' },
      }),
    );
    for (const item of page.Items ?? []) out.push(item as CheckoutOrder);
    lastKey = page.LastEvaluatedKey;
  } while (lastKey);
  return out;
}

type AuditRow = {
  orderReference: string;
  email: string;
  amountInCents: number;
  orderStatus: string;
  provisioningStatus: string;
  provisioningError: string;
  cognitoExists: string;
  entitlementRecord: string;
  entitlementStatus: string;
  provisionedOrderExists: string;
  provisionedOrderStatus: string;
  notificationStatus: string;
};

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function summarizeBucket(orders: CheckoutOrder[], withAccess: Set<string>) {
  const approved = orders.length;
  const completed = orders.filter((o) => o.provisioningStatus === 'COMPLETED').length;
  const activeEntitlement = orders.filter((o) => withAccess.has(o.reference)).length;
  const withoutAccess = orders.filter((o) => !withAccess.has(o.reference)).length;
  return { approved, completed, activeEntitlement, withoutAccess };
}

const orders = await scanApprovedRenaser();
const withAccess = new Set<string>();
const gaps: {
  reference: string;
  amountInCents: number;
  provisioningStatus: string;
  provisioningError: string;
}[] = [];
const auditRows: AuditRow[] = [];

for (const order of orders) {
  const sub = cognitoSub(order.email);
  const entByRef = await entitlementByOrderReference(order.reference);
  const entByUser = sub ? await entitlementByUserId(sub) : null;
  const active = await hasActiveRenaserEntitlement(order);
  if (active) withAccess.add(order.reference);

  const prov = await provisionedOrderSummary(order.reference);

  if (!active) {
    gaps.push({
      reference: order.reference,
      amountInCents: order.amountInCents,
      provisioningStatus: order.provisioningStatus,
      provisioningError: order.provisioningError ?? '',
    });
  }

  auditRows.push({
    orderReference: order.reference,
    email: order.email,
    amountInCents: order.amountInCents,
    orderStatus: order.status,
    provisioningStatus: order.provisioningStatus,
    provisioningError: order.provisioningError ?? '',
    cognitoExists: sub ? 'YES' : 'NO',
    entitlementRecord: entByRef || entByUser ? 'YES' : 'NO',
    entitlementStatus: entByRef?.status ?? entByUser?.status ?? 'MISSING',
    provisionedOrderExists: prov.exists ? 'YES' : 'NO',
    provisionedOrderStatus: prov.status || 'MISSING',
    notificationStatus: prov.notificationStatus || 'MISSING',
  });
}

const orders150 = orders.filter((o) => o.amountInCents === 15_000_000);
const orders250 = orders.filter((o) => o.amountInCents === 25_000_000);

const report = {
  APPROVED_RENASER_TOTAL: orders.length,
  APPROVED_WITHOUT_ENTITLEMENT: gaps.length,
  FAILED_PROVISIONING: orders.filter((o) => o.provisioningStatus === 'FAILED').length,
  INVALID_AMOUNT_FAILED: orders.filter((o) =>
    (o.provisioningError ?? '').includes('invalid_amount'),
  ).length,
  APPROVED_150K: summarizeBucket(orders150, withAccess),
  APPROVED_250K: summarizeBucket(orders250, withAccess),
  TOTAL_APPROVED: orders.length,
  TOTAL_WITH_ACTIVE_ACCESS: withAccess.size,
  TOTAL_APPROVED_WITHOUT_ACCESS: gaps.length,
  gaps,
};

console.log(JSON.stringify(report, null, 2));

if (writeCsv) {
  const rows250 = auditRows.filter((r) => r.amountInCents === 25_000_000);
  fs.mkdirSync(path.dirname(csv250Path), { recursive: true });
  const header = Object.keys(rows250[0] ?? auditRows[0] ?? {}).join(',');
  const lines = rows250.map((r) =>
    Object.values(r)
      .map((v) => csvEscape(String(v)))
      .join(','),
  );
  fs.writeFileSync(csv250Path, [header, ...lines].join('\n') + '\n', 'utf8');
}
