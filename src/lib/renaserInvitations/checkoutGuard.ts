import type { NextApiRequest } from 'next';
import { normalizeInvitationEmail } from './email';
import { isInvitationEnforcementEnabled, GENERIC_INVITATION_ERROR } from './config';
import { evaluateInvitationForAccess } from './invitationLogic';
import {
  getInvitationByTokenHash,
  tryReserveInvitationForCheckout,
} from './repository';
import { readInvitationSessionFromRequest } from './session';

export type RenaserCheckoutGuardResult =
  | {
      ok: true;
      tokenHash: string;
      emailNormalized: string;
      firstName: string;
      lastName: string;
    }
  | { ok: false; httpStatus: 403; error: string };

export async function assertRenaserInvitationCheckout(
  req: NextApiRequest,
  formEmail: string,
  orderReference: string,
): Promise<RenaserCheckoutGuardResult> {
  if (!isInvitationEnforcementEnabled()) {
    return {
      ok: true,
      tokenHash: '',
      emailNormalized: normalizeInvitationEmail(formEmail),
      firstName: '',
      lastName: '',
    };
  }

  const session = readInvitationSessionFromRequest(req.headers.cookie);
  if (!session?.th) {
    return { ok: false, httpStatus: 403, error: GENERIC_INVITATION_ERROR };
  }

  const inv = await getInvitationByTokenHash(session.th);
  const access = evaluateInvitationForAccess(inv);
  if (!access.ok) {
    return { ok: false, httpStatus: 403, error: access.message };
  }

  const emailNormalized = normalizeInvitationEmail(formEmail);
  if (emailNormalized !== access.invitation.emailNormalized) {
    return { ok: false, httpStatus: 403, error: GENERIC_INVITATION_ERROR };
  }

  const reserved = await tryReserveInvitationForCheckout(session.th, orderReference);
  if (!reserved.ok) {
    const msg =
      reserved.reason === 'purchased'
        ? 'Esta invitación ya fue utilizada.'
        : GENERIC_INVITATION_ERROR;
    return { ok: false, httpStatus: 403, error: msg };
  }

  return {
    ok: true,
    tokenHash: session.th,
    emailNormalized,
    firstName: access.invitation.firstName,
    lastName: access.invitation.lastName,
  };
}
