#!/usr/bin/env npx tsx
/**
 * Batch send purchase invitation emails via SES.
 * Default: --dry-run (no SES). Pass --send to deliver (still rate-limited).
 *
 * Tokens are read from a sidecar file written only during import (--write-tokens-dir).
 * For mass send after import, use operational flow that stores tokens securely once.
 * This script sends to rows with emailStatus=PENDING and status=AVAILABLE only.
 */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import fs from 'node:fs';
import path from 'node:path';
import { getInvitationsTableName } from '../../src/lib/renaserInvitations/config';
import { sendPurchaseInvitationEmail } from '../../src/lib/renaserInvitations/send-purchase-invitation-email';
import { updateInvitationEmailDelivery } from '../../src/lib/renaserInvitations/repository';
import type { RenaserPurchaseInvitation } from '../../src/lib/renaserInvitations/types';

const DEFAULT_BATCH = 10;
const DEFAULT_DELAY_MS = 1200;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  let dryRun = true;
  let batch = DEFAULT_BATCH;
  let delayMs = DEFAULT_DELAY_MS;
  let tokensDir = '';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--send') dryRun = false;
    if (args[i] === '--dry-run') dryRun = true;
    if (args[i] === '--batch' && args[i + 1]) batch = Number.parseInt(args[++i], 10);
    if (args[i] === '--delay-ms' && args[i + 1]) delayMs = Number.parseInt(args[++i], 10);
    if (args[i] === '--tokens-dir' && args[i + 1]) tokensDir = args[++i];
  }
  return { dryRun, batch, delayMs, tokensDir };
}

async function main() {
  const { dryRun, batch, delayMs, tokensDir } = parseArgs();
  if (!dryRun && !tokensDir) {
    console.error(
      JSON.stringify({
        ok: false,
        error: 'tokens_dir_required_for_send',
        hint: 'Import must write token sidecar to a secure directory; pass --tokens-dir',
      }),
    );
    process.exit(1);
  }

  const region =
    process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim() || 'us-east-1';
  const doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region }), {
    marshallOptions: { removeUndefinedValues: true },
  });

  let scanned = 0;
  let eligible = 0;
  let wouldSend = 0;
  let sent = 0;
  let failed = 0;
  let skippedNoToken = 0;

  let lastKey: Record<string, unknown> | undefined;
  do {
    const out = await doc.send(
      new ScanCommand({
        TableName: getInvitationsTableName(),
        ExclusiveStartKey: lastKey,
      }),
    );
    for (const item of out.Items ?? []) {
      scanned++;
      const inv = item as RenaserPurchaseInvitation;
      if (inv.status !== 'AVAILABLE') continue;
      if (inv.emailStatus !== 'PENDING' && inv.emailStatus !== undefined) continue;
      eligible++;
      if (dryRun) {
        wouldSend++;
        continue;
      }
      if (sent + failed >= batch) break;

      const tokenPath = path.join(tokensDir, `${inv.tokenHash}.token`);
      if (!fs.existsSync(tokenPath)) {
        skippedNoToken++;
        continue;
      }
      const token = fs.readFileSync(tokenPath, 'utf8').trim();

      void token;
      const result = await sendPurchaseInvitationEmail({
        emailNormalized: inv.emailNormalized,
        firstName: inv.firstName,
      });
      await updateInvitationEmailDelivery({
        emailNormalized: inv.emailNormalized,
        sent: result.sent,
        sesMessageId: result.sent ? result.messageId : undefined,
        previousAttempts: inv.emailAttempts,
      });
      if (result.sent) sent++;
      else failed++;
      await sleep(delayMs);
    }
    lastKey = out.LastEvaluatedKey;
    if (!dryRun && sent + failed >= batch) break;
  } while (lastKey);

  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun,
        scanned,
        eligible,
        wouldSend: dryRun ? wouldSend : undefined,
        sent: dryRun ? 0 : sent,
        failed: dryRun ? 0 : failed,
        skippedNoToken: dryRun ? undefined : skippedNoToken,
        realEmailsSent: dryRun ? 0 : sent,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: String(e) }));
  process.exit(1);
});
