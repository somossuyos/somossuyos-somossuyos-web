#!/usr/bin/env npx tsx
/**
 * Idempotent import of RenaSER purchase invitations from Excel.
 * Does NOT print email addresses. Tokens are generated once per new row.
 *
 * Usage:
 *   npx tsx scripts/renaser/import-purchase-invitations.mts [--file path] [--dry-run]
 */
import fs from 'node:fs';
import path from 'node:path';
import * as XLSX from 'xlsx';
import {
  maskEmailForDisplay,
  normalizeInvitationEmail,
  isValidInvitationEmailSyntax,
} from '../../src/lib/renaserInvitations/email';
import { getInvitationExpiresAt } from '../../src/lib/renaserInvitations/config';
import { generateInvitationToken, hashInvitationToken } from '../../src/lib/renaserInvitations/token';
import {
  getInvitationByEmail,
  putInvitationIfNotExists,
} from '../../src/lib/renaserInvitations/repository';

const DEFAULT_FILE = '/mnt/data/LISTADO_UNICO_RENASER_2026.xlsx';
const SHEET = 'Listado único';

type RowStats = {
  TOTAL_SOURCE_ROWS: number;
  ROWS_WITH_EMAIL: number;
  VALID_EMAILS: number;
  INVALID_EMAILS: number;
  DUPLICATE_EMAILS: number;
  VALID_UNIQUE_EMAILS: number;
  EMPTY_EMAILS: number;
  created: number;
  existing: number;
  errors: number;
  invalidSamples: { row: number; masked: string; reason: string }[];
};

function parseArgs() {
  const args = process.argv.slice(2);
  let file = DEFAULT_FILE;
  let dryRun = false;
  let writeTokensDir = '';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) file = args[++i];
    if (args[i] === '--dry-run') dryRun = true;
    if (args[i] === '--write-tokens-dir' && args[i + 1]) writeTokensDir = args[++i];
  }
  return { file, dryRun, writeTokensDir };
}

function readRows(filePath: string): Record<string, unknown>[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`SOURCE_FILE_NOT_FOUND:${filePath}`);
  }
  const wb = XLSX.readFile(filePath, { cellDates: false });
  const sheet = wb.Sheets[SHEET] ?? wb.Sheets[wb.SheetNames[0] ?? ''];
  if (!sheet) throw new Error('SHEET_NOT_FOUND');
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
}

async function main() {
  const { file, dryRun, writeTokensDir } = parseArgs();
  if (writeTokensDir && !dryRun) {
    fs.mkdirSync(writeTokensDir, { recursive: true, mode: 0o700 });
  }
  const expiresAt = getInvitationExpiresAt();
  const rows = readRows(file);
  const seen = new Set<string>();
  const stats: RowStats = {
    TOTAL_SOURCE_ROWS: rows.length,
    ROWS_WITH_EMAIL: 0,
    VALID_EMAILS: 0,
    INVALID_EMAILS: 0,
    DUPLICATE_EMAILS: 0,
    VALID_UNIQUE_EMAILS: 0,
    EMPTY_EMAILS: 0,
    created: 0,
    existing: 0,
    errors: 0,
    invalidSamples: [],
  };

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const rowNum = index + 2;
    const emailRaw =
      String(row.Correo ?? row.correo ?? row.Email ?? row.email ?? '').trim();
    if (!emailRaw) {
      stats.EMPTY_EMAILS++;
      continue;
    }
    stats.ROWS_WITH_EMAIL++;
    const email = normalizeInvitationEmail(emailRaw);
    if (!isValidInvitationEmailSyntax(email)) {
      stats.INVALID_EMAILS++;
      if (stats.invalidSamples.length < 15) {
        stats.invalidSamples.push({
          row: rowNum,
          masked: maskEmailForDisplay(email || emailRaw.toLowerCase()),
          reason: 'invalid_syntax',
        });
      }
      continue;
    }
    stats.VALID_EMAILS++;
    if (seen.has(email)) {
      stats.DUPLICATE_EMAILS++;
      continue;
    }
    seen.add(email);
    stats.VALID_UNIQUE_EMAILS++;

    const firstName = String(row.Nombres ?? row.nombres ?? '').trim();
    const lastName = String(row.Apellidos ?? row.apellidos ?? '').trim();

    if (dryRun) {
      stats.created++;
      continue;
    }

    try {
      const prior = await getInvitationByEmail(email);
      if (prior) {
        stats.existing++;
        continue;
      }
      const token = generateInvitationToken();
      const tokenHash = hashInvitationToken(token);
      const result = await putInvitationIfNotExists({
        tokenHash,
        emailNormalized: email,
        firstName,
        lastName,
        expiresAt,
      });
      if (result === 'created') {
        stats.created++;
        if (writeTokensDir) {
          fs.writeFileSync(
            path.join(writeTokensDir, `${tokenHash}.token`),
            token,
            { mode: 0o600 },
          );
        }
      } else stats.existing++;
    } catch {
      stats.errors++;
    }
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun,
        file: path.basename(file),
        ...stats,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  const msg = e instanceof Error ? e.message : String(e);
  console.error(JSON.stringify({ ok: false, error: msg }));
  process.exit(1);
});
