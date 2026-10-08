import {
  ConditionalCheckFailedException,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import type {
  CreateRenaserInvitationInput,
  RenaserPurchaseInvitation,
  RenaserInvitationStatus,
} from './types';
import { getInvitationsTableName, getReservationMinutes } from './config';
import { normalizeInvitationEmail } from './email';
import { decideCheckoutReservation, decideInvitationConsume } from './reservationPolicy';
import { getCheckoutOrderByReference } from '@/src/lib/orders/checkoutOrdersRepository';
import type { CheckoutOrder } from '@/src/lib/orders/types';

let docClient: DynamoDBDocumentClient | null = null;

function getDocClient(): DynamoDBDocumentClient {
  if (!docClient) {
    const region =
      process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim() || 'us-east-1';
    docClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region }), {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return docClient;
}

function nowIso(): string {
  return new Date().toISOString();
}

function reservationExpiresIso(fromMs = Date.now()): string {
  return new Date(fromMs + getReservationMinutes() * 60_000).toISOString();
}

function tableKeys(emailNormalized: string) {
  return { emailNormalized: emailNormalized.trim() };
}

export async function getInvitationByTokenHash(
  tokenHash: string,
): Promise<RenaserPurchaseInvitation | null> {
  const key = tokenHash?.trim();
  if (!key) return null;
  const out = await getDocClient().send(
    new QueryCommand({
      TableName: getInvitationsTableName(),
      IndexName: 'tokenHash-index',
      KeyConditionExpression: 'tokenHash = :h',
      ExpressionAttributeValues: { ':h': key },
      Limit: 1,
    }),
  );
  const item = out.Items?.[0];
  return item ? (item as RenaserPurchaseInvitation) : null;
}

export async function getInvitationByEmail(
  emailNormalized: string,
): Promise<RenaserPurchaseInvitation | null> {
  const email = normalizeInvitationEmail(emailNormalized);
  if (!email) return null;
  const out = await getDocClient().send(
    new GetCommand({
      TableName: getInvitationsTableName(),
      Key: tableKeys(email),
    }),
  );
  return out.Item ? (out.Item as RenaserPurchaseInvitation) : null;
}

/** Atomic: PK emailNormalized enforces one invitation identity per email. */
export async function putInvitationIfNotExists(
  input: CreateRenaserInvitationInput,
): Promise<'created' | 'exists'> {
  const emailNormalized = normalizeInvitationEmail(input.emailNormalized);
  const ts = nowIso();
  try {
    await getDocClient().send(
      new PutCommand({
        TableName: getInvitationsTableName(),
        Item: {
          emailNormalized,
          tokenHash: input.tokenHash,
          firstName: input.firstName,
          lastName: input.lastName,
          status: 'AVAILABLE' satisfies RenaserInvitationStatus,
          createdAt: ts,
          ...(input.expiresAt ? { expiresAt: input.expiresAt } : {}),
          emailStatus: 'PENDING',
          emailAttempts: 0,
        } satisfies RenaserPurchaseInvitation,
        ConditionExpression: 'attribute_not_exists(emailNormalized)',
      }),
    );
    return 'created';
  } catch (e) {
    if (e instanceof ConditionalCheckFailedException) return 'exists';
    throw e;
  }
}

export type CheckoutOrderLookup = (reference: string) => Promise<CheckoutOrder | null>;

async function defaultCheckoutLookup(reference: string): Promise<CheckoutOrder | null> {
  return getCheckoutOrderByReference(reference);
}

/** AVAILABLE / same ref / prior order terminal → CHECKOUT_STARTED + orderReference */
export async function tryReserveInvitationForCheckout(
  tokenHash: string,
  orderReference: string,
  lookupCheckoutOrder: CheckoutOrderLookup = defaultCheckoutLookup,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const inv = await getInvitationByTokenHash(tokenHash);
  if (!inv) return { ok: false, reason: 'not_found' };

  const priorRef = inv.orderReference?.trim();
  const priorStatus = priorRef ? (await lookupCheckoutOrder(priorRef))?.status ?? null : null;

  const decision = decideCheckoutReservation(inv, orderReference, priorStatus);
  if (decision.action === 'deny') {
    return { ok: false, reason: decision.reason };
  }

  const ts = nowIso();
  const reservationExpiresAt = reservationExpiresIso();
  const emailKey = inv.emailNormalized;

  if (decision.mode === 'same_reference') {
    await getDocClient().send(
      new UpdateCommand({
        TableName: getInvitationsTableName(),
        Key: tableKeys(emailKey),
        UpdateExpression: 'SET reservationExpiresAt = :exp, updatedAt = :u',
        ExpressionAttributeValues: { ':exp': reservationExpiresAt, ':u': ts },
      }),
    );
    return { ok: true };
  }

  if (decision.mode === 'from_available') {
    try {
      await getDocClient().send(
        new UpdateCommand({
          TableName: getInvitationsTableName(),
          Key: tableKeys(emailKey),
          UpdateExpression:
            'SET #st = :started, orderReference = :ref, reservationExpiresAt = :exp, updatedAt = :u',
          ConditionExpression: '#st = :avail',
          ExpressionAttributeNames: { '#st': 'status' },
          ExpressionAttributeValues: {
            ':started': 'CHECKOUT_STARTED',
            ':avail': 'AVAILABLE',
            ':ref': orderReference,
            ':exp': reservationExpiresAt,
            ':u': ts,
          },
        }),
      );
      return { ok: true };
    } catch (e) {
      if (e instanceof ConditionalCheckFailedException) {
        return tryReserveInvitationForCheckout(tokenHash, orderReference, lookupCheckoutOrder);
      }
      throw e;
    }
  }

  try {
    await getDocClient().send(
      new UpdateCommand({
        TableName: getInvitationsTableName(),
        Key: tableKeys(emailKey),
        UpdateExpression:
          'SET orderReference = :ref, reservationExpiresAt = :exp, updatedAt = :u',
        ConditionExpression: '#st = :started AND orderReference = :oldRef',
        ExpressionAttributeNames: { '#st': 'status' },
        ExpressionAttributeValues: {
          ':started': 'CHECKOUT_STARTED',
          ':oldRef': priorRef,
          ':ref': orderReference,
          ':exp': reservationExpiresAt,
          ':u': ts,
        },
      }),
    );
    return { ok: true };
  } catch (e) {
    if (e instanceof ConditionalCheckFailedException) {
      return { ok: false, reason: 'concurrent_checkout' };
    }
    throw e;
  }
}

export async function releaseInvitationReservation(orderReference: string): Promise<void> {
  if (!orderReference?.trim()) return;
  const ts = nowIso();
  const table = getInvitationsTableName();
  const out = await getDocClient().send(
    new QueryCommand({
      TableName: table,
      IndexName: 'orderReference-index',
      KeyConditionExpression: 'orderReference = :ref',
      ExpressionAttributeValues: { ':ref': orderReference.trim() },
      Limit: 1,
    }),
  );
  const item = out.Items?.[0] as RenaserPurchaseInvitation | undefined;
  if (!item || item.status !== 'CHECKOUT_STARTED') return;

  await getDocClient().send(
    new UpdateCommand({
      TableName: table,
      Key: tableKeys(item.emailNormalized),
      UpdateExpression:
        'SET #st = :avail, updatedAt = :u REMOVE orderReference, reservationExpiresAt',
      ConditionExpression: '#st = :started AND orderReference = :ref',
      ExpressionAttributeNames: { '#st': 'status' },
      ExpressionAttributeValues: {
        ':avail': 'AVAILABLE',
        ':started': 'CHECKOUT_STARTED',
        ':ref': orderReference.trim(),
        ':u': ts,
      },
    }),
  );
}

export async function updateInvitationEmailDelivery(params: {
  emailNormalized: string;
  sent: boolean;
  sesMessageId?: string;
  previousAttempts?: number;
}): Promise<void> {
  const ts = nowIso();
  const attempts = (params.previousAttempts ?? 0) + 1;
  await getDocClient().send(
    new UpdateCommand({
      TableName: getInvitationsTableName(),
      Key: tableKeys(params.emailNormalized),
      UpdateExpression:
        'SET emailStatus = :st, emailAttempts = :att, emailSentAt = :sentAt' +
        (params.sesMessageId ? ', sesMessageId = :mid' : '') +
        (params.sent ? '' : ', emailErrorCode = :err'),
      ExpressionAttributeValues: {
        ':st': params.sent ? 'SENT' : 'FAILED',
        ':att': attempts,
        ':sentAt': ts,
        ...(params.sesMessageId ? { ':mid': params.sesMessageId } : {}),
        ...(!params.sent ? { ':err': 'ses_send_failed' } : {}),
      },
    }),
  );
}

export async function markInvitationPurchasedIdempotent(
  tokenHash: string,
  orderReference: string,
  wompiTransactionId: string,
  emailNormalized: string,
): Promise<{ ok: true; already: boolean } | { ok: false; reason: string }> {
  const inv = await getInvitationByTokenHash(tokenHash);
  if (!inv) return { ok: false, reason: 'not_found' };

  const email = normalizeInvitationEmail(emailNormalized);
  const decision = decideInvitationConsume(inv, orderReference, email);
  if (decision.action === 'deny') {
    return { ok: false, reason: decision.reason };
  }
  if (decision.mode === 'idempotent_repeat') {
    return { ok: true, already: true };
  }

  const ts = nowIso();
  try {
    await getDocClient().send(
      new UpdateCommand({
        TableName: getInvitationsTableName(),
        Key: tableKeys(inv.emailNormalized),
        UpdateExpression:
          'SET #st = :pur, usedAt = :u, orderReference = :ref, wompiTransactionId = :tid REMOVE reservationExpiresAt',
        ConditionExpression: '#st = :started AND orderReference = :ref',
        ExpressionAttributeNames: { '#st': 'status' },
        ExpressionAttributeValues: {
          ':pur': 'PURCHASED',
          ':started': 'CHECKOUT_STARTED',
          ':ref': orderReference,
          ':tid': wompiTransactionId,
          ':u': ts,
        },
      }),
    );
    return { ok: true, already: false };
  } catch (e) {
    if (e instanceof ConditionalCheckFailedException) {
      const again = await getInvitationByTokenHash(tokenHash);
      const retry = again
        ? decideInvitationConsume(again, orderReference, email)
        : { action: 'deny' as const, reason: 'not_found' };
      if (retry.action === 'allow' && retry.mode === 'idempotent_repeat') {
        return { ok: true, already: true };
      }
      return { ok: false, reason: 'consume_conflict' };
    }
    throw e;
  }
}

export function createInMemoryInvitationsRepository(options?: {
  lookupCheckoutOrder?: CheckoutOrderLookup;
}) {
  const byEmail = new Map<string, RenaserPurchaseInvitation>();
  const hashToEmail = new Map<string, string>();
  const pendingEmailCreates = new Set<string>();

  const lookup =
    options?.lookupCheckoutOrder ??
    (async () => null as CheckoutOrder | null);

  return {
    byEmail,
    async getInvitationByTokenHash(tokenHash: string) {
      const email = hashToEmail.get(tokenHash.trim());
      return email ? byEmail.get(email) ?? null : null;
    },
    async getInvitationByEmail(emailNormalized: string) {
      return byEmail.get(normalizeInvitationEmail(emailNormalized)) ?? null;
    },
    async putInvitationIfNotExists(input: CreateRenaserInvitationInput) {
      const emailNormalized = normalizeInvitationEmail(input.emailNormalized);
      if (byEmail.has(emailNormalized) || pendingEmailCreates.has(emailNormalized)) {
        return 'exists' as const;
      }
      pendingEmailCreates.add(emailNormalized);
      await new Promise<void>((resolve) => setImmediate(resolve));
      if (byEmail.has(emailNormalized)) {
        pendingEmailCreates.delete(emailNormalized);
        return 'exists' as const;
      }
      const ts = nowIso();
      const inv: RenaserPurchaseInvitation = {
        tokenHash: input.tokenHash,
        emailNormalized,
        firstName: input.firstName,
        lastName: input.lastName,
        status: 'AVAILABLE',
        createdAt: ts,
        expiresAt: input.expiresAt,
        emailStatus: 'PENDING',
        emailAttempts: 0,
      };
      byEmail.set(emailNormalized, inv);
      hashToEmail.set(input.tokenHash, emailNormalized);
      pendingEmailCreates.delete(emailNormalized);
      return 'created' as const;
    },
    async tryReserveInvitationForCheckout(tokenHash: string, orderReference: string) {
      const inv = await this.getInvitationByTokenHash(tokenHash);
      if (!inv) return { ok: false as const, reason: 'not_found' };
      const priorRef = inv.orderReference?.trim();
      const priorOrder = priorRef ? await lookup(priorRef) : null;
      const decision = decideCheckoutReservation(inv, orderReference, priorOrder?.status ?? null);
      if (decision.action === 'deny') {
        return { ok: false as const, reason: decision.reason };
      }
      if (decision.mode === 'same_reference') {
        inv.reservationExpiresAt = reservationExpiresIso();
        return { ok: true as const };
      }
      inv.status = 'CHECKOUT_STARTED';
      inv.orderReference = orderReference;
      inv.reservationExpiresAt = reservationExpiresIso();
      return { ok: true as const };
    },
    async releaseInvitationReservation(orderReference: string) {
      for (const inv of Array.from(byEmail.values())) {
        if (inv.orderReference === orderReference && inv.status === 'CHECKOUT_STARTED') {
          inv.status = 'AVAILABLE';
          delete inv.orderReference;
          delete inv.reservationExpiresAt;
        }
      }
    },
    async markInvitationPurchasedIdempotent(
      tokenHash: string,
      orderReference: string,
      wompiTransactionId: string,
      emailNormalized: string,
    ) {
      const inv = await this.getInvitationByTokenHash(tokenHash);
      if (!inv) return { ok: false as const, reason: 'not_found' };
      const decision = decideInvitationConsume(inv, orderReference, normalizeInvitationEmail(emailNormalized));
      if (decision.action === 'deny') {
        return { ok: false as const, reason: decision.reason };
      }
      if (decision.mode === 'idempotent_repeat') {
        return { ok: true as const, already: true };
      }
      inv.status = 'PURCHASED';
      inv.usedAt = nowIso();
      inv.orderReference = orderReference;
      inv.wompiTransactionId = wompiTransactionId;
      delete inv.reservationExpiresAt;
      return { ok: true as const, already: false };
    },
  };
}

export type RenaserInvitationsRepository = ReturnType<typeof createInMemoryInvitationsRepository>;
