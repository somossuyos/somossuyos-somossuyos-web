import crypto from 'node:crypto';
import fs from 'node:fs';

/** Ciphertext vault for mailing (tokenHash → encrypted token). Never commit vault files. */
export function encryptTokenForVault(token: string, secret: string): string {
  const key = crypto.createHash('sha256').update(secret, 'utf8').digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64url');
}

export function decryptTokenFromVault(ciphertext: string, secret: string): string {
  const key = crypto.createHash('sha256').update(secret, 'utf8').digest();
  const buf = Buffer.from(ciphertext, 'base64url');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}

export type VaultEntry = { tokenHash: string; tokenEnc: string };

export function appendVaultEntry(filePath: string, entry: VaultEntry): void {
  fs.appendFileSync(filePath, `${JSON.stringify(entry)}\n`, { encoding: 'utf8', mode: 0o600 });
}

export function readVaultEntries(filePath: string): VaultEntry[] {
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l) as VaultEntry);
}
