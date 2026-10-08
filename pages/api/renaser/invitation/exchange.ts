import type { NextApiRequest, NextApiResponse } from 'next';
import { hashInvitationToken } from '@/src/lib/renaserInvitations/token';
import { evaluateInvitationForAccess } from '@/src/lib/renaserInvitations/invitationLogic';
import { getInvitationByTokenHash } from '@/src/lib/renaserInvitations/repository';
import { maskEmailForDisplay } from '@/src/lib/renaserInvitations/email';
import {
  createInvitationSessionValue,
  invitationSessionCookieHeader,
} from '@/src/lib/renaserInvitations/session';
import { GENERIC_INVITATION_ERROR } from '@/src/lib/renaserInvitations/config';

type ExchangeOk = {
  ok: true;
  firstName: string;
  lastName: string;
  emailMasked: string;
  redirectPath: string;
};

type ExchangeErr = { ok: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExchangeOk | ExchangeErr>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const tokenRaw = typeof req.body?.token === 'string' ? req.body.token.trim() : '';
  if (!tokenRaw || tokenRaw.length < 20) {
    return res.status(400).json({ ok: false, error: GENERIC_INVITATION_ERROR });
  }

  const tokenHash = hashInvitationToken(tokenRaw);
  const inv = await getInvitationByTokenHash(tokenHash);
  const access = evaluateInvitationForAccess(inv);
  if (!access.ok) {
    return res.status(403).json({ ok: false, error: access.message });
  }

  const sessionValue = createInvitationSessionValue(tokenHash);
  if (!sessionValue) {
    return res.status(500).json({ ok: false, error: GENERIC_INVITATION_ERROR });
  }

  res.setHeader('Set-Cookie', invitationSessionCookieHeader(sessionValue));

  return res.status(200).json({
    ok: true,
    firstName: access.invitation.firstName,
    lastName: access.invitation.lastName,
    emailMasked: maskEmailForDisplay(access.invitation.emailNormalized),
    redirectPath: '/renaser/invitacion',
  });
}
