import {
  buildPurchaseInvitationEmail,
  PURCHASE_INVITATION_CTA_LABEL,
  PURCHASE_INVITATION_SUBJECT,
} from './invitation-email-template';
import { buildInvitationLandingUrl } from './config';

export type RenaserInvitationEmailContent = {
  subject: string;
  text: string;
  html: string;
};

export function buildRenaserInvitationEmail(params: {
  firstName: string;
  invitationUrl: string;
}): RenaserInvitationEmailContent {
  let token = '';
  try {
    token = new URL(params.invitationUrl).searchParams.get('t')?.trim() ?? '';
  } catch {
    token = '';
  }
  const built = buildPurchaseInvitationEmail({
    firstName: params.firstName,
    token: token || 'placeholder',
  });
  return {
    subject: PURCHASE_INVITATION_SUBJECT,
    text: built.text,
    html: built.html,
  };
}

export function invitationUrlFromToken(token: string): string {
  return buildInvitationLandingUrl(token);
}

export { PURCHASE_INVITATION_CTA_LABEL, PURCHASE_INVITATION_SUBJECT };
