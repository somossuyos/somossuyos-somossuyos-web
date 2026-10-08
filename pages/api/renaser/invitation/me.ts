import type { NextApiRequest, NextApiResponse } from 'next';
import { evaluateInvitationForAccess } from '@/src/lib/renaserInvitations/invitationLogic';
import { getInvitationByTokenHash } from '@/src/lib/renaserInvitations/repository';
import { maskEmailForDisplay } from '@/src/lib/renaserInvitations/email';
import { readInvitationSessionFromRequest } from '@/src/lib/renaserInvitations/session';
import {
  AULA_VIRTUAL_URL,
  GENERIC_INVITATION_ERROR,
  INVITATION_ALREADY_USED_MESSAGE,
} from '@/src/lib/renaserInvitations/config';

type MeOk = {
  ok: true;
  firstName: string;
  lastName: string;
  emailMasked: string;
  /** Solo para titular de sesión HttpOnly (prefill checkout). */
  emailNormalized: string;
  canPurchase: boolean;
  alreadyPurchased: boolean;
  aulaUrl: string;
};

type MeErr = { ok: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MeOk | MeErr>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const session = readInvitationSessionFromRequest(req.headers.cookie);
  if (!session?.th) {
    return res.status(401).json({ ok: false, error: GENERIC_INVITATION_ERROR });
  }

  const inv = await getInvitationByTokenHash(session.th);
  const access = evaluateInvitationForAccess(inv);
  if (!access.ok) {
    const msg =
      access.code === 'purchased' ? INVITATION_ALREADY_USED_MESSAGE : access.message;
    return res.status(403).json({ ok: false, error: msg });
  }

  return res.status(200).json({
    ok: true,
    firstName: access.invitation.firstName,
    lastName: access.invitation.lastName,
    emailMasked: maskEmailForDisplay(access.invitation.emailNormalized),
    emailNormalized: access.invitation.emailNormalized,
    canPurchase: true,
    alreadyPurchased: false,
    aulaUrl: AULA_VIRTUAL_URL,
  });
}
