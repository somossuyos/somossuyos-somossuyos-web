#!/usr/bin/env npx tsx
/** Aggregate invitation stats (no PII in output). */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { getInvitationsTableName } from '../../src/lib/renaserInvitations/config';
import type { RenaserPurchaseInvitation } from '../../src/lib/renaserInvitations/types';

async function main() {
  const region =
    process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim() || 'us-east-1';
  const doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region }), {
    marshallOptions: { removeUndefinedValues: true },
  });

  const counts = {
    TOTAL_INVITED: 0,
    AVAILABLE: 0,
    CHECKOUT_STARTED: 0,
    PURCHASED: 0,
    DISABLED: 0,
    EMAIL_PENDING: 0,
    EMAIL_SENT: 0,
    EMAIL_FAILED: 0,
    BOUNCE_OR_COMPLAINT: 0,
  };

  let lastKey: Record<string, unknown> | undefined;
  do {
    const out = await doc.send(
      new ScanCommand({
        TableName: getInvitationsTableName(),
        ProjectionExpression: '#st, emailStatus, bounceOrComplaintAt',
        ExpressionAttributeNames: { '#st': 'status' },
        ExclusiveStartKey: lastKey,
      }),
    );
    for (const item of out.Items ?? []) {
      const inv = item as Pick<
        RenaserPurchaseInvitation,
        'status' | 'emailStatus' | 'bounceOrComplaintAt'
      >;
      counts.TOTAL_INVITED++;
      if (inv.status === 'AVAILABLE') counts.AVAILABLE++;
      else if (inv.status === 'CHECKOUT_STARTED') counts.CHECKOUT_STARTED++;
      else if (inv.status === 'PURCHASED') counts.PURCHASED++;
      else if (inv.status === 'DISABLED') counts.DISABLED++;
      if (inv.emailStatus === 'PENDING') counts.EMAIL_PENDING++;
      else if (inv.emailStatus === 'SENT') counts.EMAIL_SENT++;
      else if (inv.emailStatus === 'FAILED') counts.EMAIL_FAILED++;
      if (inv.bounceOrComplaintAt) counts.BOUNCE_OR_COMPLAINT++;
    }
    lastKey = out.LastEvaluatedKey;
  } while (lastKey);

  console.log(JSON.stringify({ ok: true, ...counts }, null, 2));
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: String(e) }));
  process.exit(1);
});
