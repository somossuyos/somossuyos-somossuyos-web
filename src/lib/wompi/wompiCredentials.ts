import { isRenaserOrderReference } from '@/src/lib/orders/reference';

export type WompiChannel = 'default' | 'renaser';

export type WompiServerCredentials = {
  channel: WompiChannel;
  publicKey: string;
  integritySecret: string;
  eventsSecret: string;
  privateKey: string;
};

function trimEnv(name: string): string {
  return process.env[name]?.trim() ?? '';
}

/** Credenciales Wompi producción / tienda general (libros, Novena, experiencias, etc.). */
export function getDefaultWompiCredentials(): WompiServerCredentials {
  return {
    channel: 'default',
    publicKey: trimEnv('WOMPI_PUBLIC_KEY') || trimEnv('NEXT_PUBLIC_WOMPI_PUBLIC_KEY'),
    integritySecret: trimEnv('WOMPI_INTEGRITY_SECRET'),
    eventsSecret: trimEnv('WOMPI_EVENTS_SECRET'),
    privateKey: trimEnv('WOMPI_PRIVATE_KEY'),
  };
}

/** Credenciales Wompi sandbox dedicadas a RenaSER (Memorias courseId 20260720). */
export function getRenaserWompiCredentials(): WompiServerCredentials {
  return {
    channel: 'renaser',
    publicKey:
      trimEnv('RENASER_WOMPI_PUBLIC_KEY') || trimEnv('NEXT_PUBLIC_RENASER_WOMPI_PUBLIC_KEY'),
    integritySecret: trimEnv('RENASER_WOMPI_INTEGRITY_SECRET'),
    eventsSecret: trimEnv('RENASER_WOMPI_EVENTS_SECRET'),
    privateKey: trimEnv('RENASER_WOMPI_PRIVATE_KEY'),
  };
}

export function isRenaserWompiConfigured(): boolean {
  const c = getRenaserWompiCredentials();
  return Boolean(c.publicKey && c.integritySecret && c.eventsSecret);
}

/** create-order: RenaSER usa sandbox aislado; resto de la tienda usa Wompi global. */
export function resolveWompiCredentialsForCheckout(isRenaserProduct: boolean): WompiServerCredentials {
  if (isRenaserProduct) {
    return getRenaserWompiCredentials();
  }
  return getDefaultWompiCredentials();
}

/** Webhook: referencia ss-renaser-* → secret de eventos RenaSER. */
export function resolveWompiEventsSecretForWebhook(reference: string | undefined): {
  channel: WompiChannel;
  eventsSecret: string;
} {
  if (isRenaserOrderReference(reference)) {
    return { channel: 'renaser', eventsSecret: getRenaserWompiCredentials().eventsSecret };
  }
  return { channel: 'default', eventsSecret: getDefaultWompiCredentials().eventsSecret };
}

/** Consulta API merchant: probar default y RenaSER si hace falta (confirmación de pago). */
export function getWompiPrivateKeysForTransactionLookup(): string[] {
  const keys = [
    getDefaultWompiCredentials().privateKey,
    getRenaserWompiCredentials().privateKey,
  ].filter((k, i, arr) => k && arr.indexOf(k) === i);
  return keys;
}

export function resolveWompiPrivateKeyForReference(reference: string | undefined): string {
  if (isRenaserOrderReference(reference)) {
    return getRenaserWompiCredentials().privateKey || getDefaultWompiCredentials().privateKey;
  }
  return getDefaultWompiCredentials().privateKey;
}
