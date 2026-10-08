import type { NextApiRequest, NextApiResponse } from 'next';
import { maskEmailForDisplay } from '@/src/lib/renaserInvitations/email';
import {
  invitationSessionCookieHeader,
} from '@/src/lib/renaserInvitations/session';
import { GENERIC_INVITATION_ERROR } from '@/src/lib/renaserInvitations/config';
import { performInvitationExchange } from '@/src/lib/renaserInvitations/exchangeInvitation';

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

  try {
    const result = await performInvitationExchange(req.body?.token);
    if (!result.ok) {
      return res.status(result.httpStatus).json({ ok: false, error: result.error });
    }

    res.setHeader('Set-Cookie', invitationSessionCookieHeader(result.sessionValue));

    return res.status(200).json({
      ok: true,
      firstName: result.invitation.firstName,
      lastName: result.invitation.lastName,
      emailMasked: maskEmailForDisplay(result.invitation.emailNormalized),
      redirectPath: '/renaser/invitacion',
    });
  } catch (e) {
    const name = e instanceof Error ? e.name : 'UnknownError';
    console.error('[renaser/invitation/exchange] unexpected error', {
      errorName: name,
      message: e instanceof Error ? e.message.slice(0, 200) : 'unknown',
    });
    return res.status(503).json({ ok: false, error: GENERIC_INVITATION_ERROR });
  }
}
