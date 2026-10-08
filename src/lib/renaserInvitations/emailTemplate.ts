import {
  buildPurchaseInvitationEmail,
  PURCHASE_INVITATION_CTA_LABEL,
  PURCHASE_INVITATION_SUBJECT,
} from './invitation-email-template';
import { buildSharedBenefitLandingUrl } from '@/src/lib/renaserBenefit/config';

export type RenaserInvitationEmailContent = {
  subject: string;
  text: string;
  html: string;
};

export function buildRenaserInvitationEmail(params: {
  firstName: string;
}): RenaserInvitationEmailContent {
  const built = buildPurchaseInvitationEmail({
    firstName: params.firstName,
  });
  return {
    subject: PURCHASE_INVITATION_SUBJECT,
    text: built.text,
    html: built.html,
  };
}

/** @deprecated Legacy per-token URLs; use buildSharedBenefitLandingUrl(). */
export function invitationUrlFromToken(_token: string): string | null {
  return buildSharedBenefitLandingUrl();
}

export { PURCHASE_INVITATION_CTA_LABEL, PURCHASE_INVITATION_SUBJECT };
