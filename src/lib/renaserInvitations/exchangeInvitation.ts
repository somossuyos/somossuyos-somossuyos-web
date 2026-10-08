import { evaluateInvitationForAccess } from './invitationLogic';
import { getInvitationByTokenHash as defaultGetInvitationByTokenHash } from './repository';
import { hashInvitationToken } from './token';
import { createInvitationSessionValue as defaultCreateSession } from './session';
import { GENERIC_INVITATION_ERROR, INVITATION_ALREADY_USED_MESSAGE } from './config';
import type { RenaserPurchaseInvitation } from './types';

export type InvitationExchangeSuccess = {
  ok: true;
  sessionValue: string;
  invitation: RenaserPurchaseInvitation;
};

export type InvitationExchangeFailure = {
  ok: false;
  httpStatus: number;
  error: string;
  code: string;
};

export type InvitationExchangeResult = InvitationExchangeSuccess | InvitationExchangeFailure;

function httpStatusForAccessCode(
  code: 'not_found' | 'expired' | 'disabled' | 'purchased' | 'unavailable',
): number {
  if (code === 'purchased') return 403;
  if (code === 'not_found' || code === 'expired') return 410;
  if (code === 'disabled' || code === 'unavailable') return 403;
  return 403;
}

export function validateInvitationExchangeToken(tokenRaw: unknown): string | null {
  const token = typeof tokenRaw === 'string' ? tokenRaw.trim() : '';
  if (!token || token.length < 20) return null;
  return token;
}

export type InvitationExchangeDeps = {
  getInvitationByTokenHash: (tokenHash: string) => Promise<RenaserPurchaseInvitation | null>;
  createSession: (tokenHash: string) => string | null;
};

const defaultDeps: InvitationExchangeDeps = {
  getInvitationByTokenHash: defaultGetInvitationByTokenHash,
  createSession: defaultCreateSession,
};

export async function performInvitationExchange(
  tokenRaw: unknown,
  deps: InvitationExchangeDeps = defaultDeps,
): Promise<InvitationExchangeResult> {
  const token = validateInvitationExchangeToken(tokenRaw);
  if (!token) {
    return {
      ok: false,
      httpStatus: 400,
      error: GENERIC_INVITATION_ERROR,
      code: 'invalid_token',
    };
  }

  let tokenHash: string;
  try {
    tokenHash = hashInvitationToken(token);
  } catch {
    return {
      ok: false,
      httpStatus: 400,
      error: GENERIC_INVITATION_ERROR,
      code: 'invalid_token',
    };
  }

  let inv: RenaserPurchaseInvitation | null;
  try {
    inv = await deps.getInvitationByTokenHash(tokenHash);
  } catch (e) {
    const name = e instanceof Error ? e.name : 'UnknownError';
    console.error('[renaser/invitation/exchange] invitation lookup failed', {
      errorName: name,
      message: e instanceof Error ? e.message.slice(0, 200) : 'unknown',
    });
    return {
      ok: false,
      httpStatus: 503,
      error: GENERIC_INVITATION_ERROR,
      code: 'invitation_lookup_failed',
    };
  }

  const access = evaluateInvitationForAccess(inv);
  if (!access.ok) {
    const msg =
      access.code === 'purchased' ? INVITATION_ALREADY_USED_MESSAGE : access.message;
    return {
      ok: false,
      httpStatus: httpStatusForAccessCode(access.code),
      error: msg,
      code: access.code,
    };
  }

  const sessionValue = deps.createSession(tokenHash);
  if (!sessionValue) {
    console.error('[renaser/invitation/exchange] session secret not configured');
    return {
      ok: false,
      httpStatus: 503,
      error: GENERIC_INVITATION_ERROR,
      code: 'session_not_configured',
    };
  }

  return { ok: true, sessionValue, invitation: access.invitation };
}
