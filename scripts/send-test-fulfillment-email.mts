import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnvFile(filename: string) {
  try {
    const content = readFileSync(resolve(process.cwd(), filename), 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* ignore */
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

const email = process.argv[2] || 'rronicolas31333@gmail.com';

const { sendDigitalFulfillmentEmail } = await import('../src/lib/wompi/digitalFulfillment.ts');

const result = await sendDigitalFulfillmentEmail({
  transactionId: `test-manual-${Date.now()}`,
  email,
  reference: 'test-novena-aprobada',
  fullName: 'Nicolás',
  productName: 'Novena E.S. Digital',
});

console.log('Destino:', email);
console.log('FROM:', process.env.RESEND_FROM_EMAIL || '(default)');
console.log('Resultado:', result);
if (result.sent && result.emailId) {
  console.log('Rastrea en Resend → Emails → ID:', result.emailId);
}
process.exit(result.sent ? 0 : 1);
