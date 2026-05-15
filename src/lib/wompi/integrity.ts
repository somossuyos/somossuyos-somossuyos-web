import crypto from 'node:crypto';

const COP = 'COP';

/** Wompi: SHA256(hex) de Referencia+Monto+COP+SecretoIntegridad (sin separadores). */
export function encodeWidgetIntegritySha256(props: {
  reference: string;
  amountInCents: number;
  currency?: string;
  integritySecret: string;
  expirationTime?: string | null;
}): string {
  const { reference, amountInCents, integritySecret } = props;
  const currency = props.currency ?? COP;
  let payload = `${reference}${amountInCents}${currency}${integritySecret}`;
  if (props.expirationTime) {
    payload = `${reference}${amountInCents}${currency}${props.expirationTime}${integritySecret}`;
  }
  return crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
}
