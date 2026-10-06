import {
  ConditionalCheckFailedException,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import type {
  CheckoutOrder,
  CheckoutOrderStatus,
  CreatePendingCheckoutOrderInput,
  ProvisioningStatus,
} from './types';

const DEFAULT_TABLE = 'SomosSuyosCheckoutOrders';

let docClient: DynamoDBDocumentClient | null = null;

function getTableName(): string {
  return process.env.SOMOSSUYOS_ORDERS_TABLE_NAME?.trim() || DEFAULT_TABLE;
}

function getDocClient(): DynamoDBDocumentClient {
  if (!docClient) {
    const region = process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim() || 'us-east-1';
    docClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region }), {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return docClient;
}

function nowIso(): string {
  return new Date().toISOString();
}

export async function putPendingCheckoutOrder(
  input: CreatePendingCheckoutOrderInput,
): Promise<CheckoutOrder> {
  const ts = nowIso();
  const order: CheckoutOrder = {
    reference: input.reference,
    productId: input.productId,
    productSlug: input.productSlug,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    amountInCents: input.amountInCents,
    currency: input.currency,
    status: input.status ?? 'PENDING',
    createdAt: ts,
    updatedAt: ts,
    provisioningStatus: input.provisioningStatus ?? 'NOT_STARTED',
  };

  await getDocClient().send(
    new PutCommand({
      TableName: getTableName(),
      Item: order,
      ConditionExpression: 'attribute_not_exists(#ref)',
      ExpressionAttributeNames: { '#ref': 'reference' },
    }),
  );

  return order;
}

export async function getCheckoutOrderByReference(reference: string): Promise<CheckoutOrder | null> {
  const ref = reference?.trim();
  if (!ref) return null;

  const out = await getDocClient().send(
    new GetCommand({
      TableName: getTableName(),
      Key: { reference: ref },
    }),
  );

  if (!out.Item) return null;
  return out.Item as CheckoutOrder;
}

export async function updateCheckoutOrderStatus(
  reference: string,
  status: CheckoutOrderStatus,
  wompiTransactionId?: string,
): Promise<void> {
  const ts = nowIso();
  await getDocClient().send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { reference },
      UpdateExpression:
        'SET #st = :st, updatedAt = :u' +
        (wompiTransactionId ? ', wompiTransactionId = :tid' : ''),
      ExpressionAttributeNames: { '#st': 'status' },
      ExpressionAttributeValues: {
        ':st': status,
        ':u': ts,
        ...(wompiTransactionId ? { ':tid': wompiTransactionId } : {}),
      },
    }),
  );
}

/** NOT_STARTED → PROCESSING (idempotente: false si ya PROCESSING/COMPLETED). */
export async function tryMarkProvisioningProcessing(reference: string): Promise<boolean> {
  const ts = nowIso();
  try {
    await getDocClient().send(
      new UpdateCommand({
        TableName: getTableName(),
        Key: { reference },
        UpdateExpression: 'SET provisioningStatus = :proc, updatedAt = :u',
        ConditionExpression: 'provisioningStatus = :notStarted',
        ExpressionAttributeValues: {
          ':proc': 'PROCESSING',
          ':notStarted': 'NOT_STARTED',
          ':u': ts,
        },
      }),
    );
    return true;
  } catch (e) {
    if (e instanceof ConditionalCheckFailedException) return false;
    throw e;
  }
}

/** Reintento tras FAILED: FAILED → PROCESSING. */
export async function tryMarkProvisioningRetry(reference: string): Promise<boolean> {
  const ts = nowIso();
  try {
    await getDocClient().send(
      new UpdateCommand({
        TableName: getTableName(),
        Key: { reference },
        UpdateExpression: 'SET provisioningStatus = :proc, updatedAt = :u REMOVE provisioningError',
        ConditionExpression: 'provisioningStatus = :failed AND #st = :approved',
        ExpressionAttributeNames: { '#st': 'status' },
        ExpressionAttributeValues: {
          ':proc': 'PROCESSING',
          ':failed': 'FAILED',
          ':approved': 'APPROVED',
          ':u': ts,
        },
      }),
    );
    return true;
  } catch (e) {
    if (e instanceof ConditionalCheckFailedException) return false;
    throw e;
  }
}

export async function markProvisioningCompleted(reference: string): Promise<void> {
  const ts = nowIso();
  await getDocClient().send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { reference },
      UpdateExpression: 'SET provisioningStatus = :done, updatedAt = :u REMOVE provisioningError',
      ExpressionAttributeValues: {
        ':done': 'COMPLETED',
        ':u': ts,
      },
    }),
  );
}

export async function markProvisioningFailed(reference: string, error: string): Promise<void> {
  const ts = nowIso();
  const safe = error.slice(0, 500);
  await getDocClient().send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { reference },
      UpdateExpression: 'SET provisioningStatus = :fail, provisioningError = :err, updatedAt = :u',
      ExpressionAttributeValues: {
        ':fail': 'FAILED',
        ':err': safe,
        ':u': ts,
      },
    }),
  );
}

/** In-memory store para tests. */
export function createInMemoryCheckoutOrdersRepository() {
  const store = new Map<string, CheckoutOrder>();

  return {
    store,
    async putPendingCheckoutOrder(input: CreatePendingCheckoutOrderInput): Promise<CheckoutOrder> {
      if (store.has(input.reference)) {
        throw new Error('conditional_check_failed');
      }
      const ts = new Date().toISOString();
      const order: CheckoutOrder = {
        ...input,
        status: input.status ?? 'PENDING',
        createdAt: ts,
        updatedAt: ts,
        provisioningStatus: input.provisioningStatus ?? 'NOT_STARTED',
      };
      store.set(input.reference, order);
      return order;
    },
    async getCheckoutOrderByReference(reference: string): Promise<CheckoutOrder | null> {
      return store.get(reference.trim()) ?? null;
    },
    async updateCheckoutOrderStatus(
      reference: string,
      status: CheckoutOrderStatus,
      wompiTransactionId?: string,
    ): Promise<void> {
      const o = store.get(reference);
      if (!o) return;
      o.status = status;
      o.updatedAt = new Date().toISOString();
      if (wompiTransactionId) o.wompiTransactionId = wompiTransactionId;
    },
    async tryMarkProvisioningProcessing(reference: string): Promise<boolean> {
      const o = store.get(reference);
      if (!o || o.provisioningStatus !== 'NOT_STARTED') return false;
      o.provisioningStatus = 'PROCESSING';
      o.updatedAt = new Date().toISOString();
      return true;
    },
    async tryMarkProvisioningRetry(reference: string): Promise<boolean> {
      const o = store.get(reference);
      if (!o || o.provisioningStatus !== 'FAILED' || o.status !== 'APPROVED') return false;
      o.provisioningStatus = 'PROCESSING';
      delete o.provisioningError;
      o.updatedAt = new Date().toISOString();
      return true;
    },
    async markProvisioningCompleted(reference: string): Promise<void> {
      const o = store.get(reference);
      if (!o) return;
      o.provisioningStatus = 'COMPLETED';
      delete o.provisioningError;
      o.updatedAt = new Date().toISOString();
    },
    async markProvisioningFailed(reference: string, error: string): Promise<void> {
      const o = store.get(reference);
      if (!o) return;
      o.provisioningStatus = 'FAILED';
      o.provisioningError = error.slice(0, 500);
      o.updatedAt = new Date().toISOString();
    },
  };
}

export type CheckoutOrdersRepository = ReturnType<typeof createInMemoryCheckoutOrdersRepository>;
