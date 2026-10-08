#!/usr/bin/env npx tsx
/** Two pilot emails, same shared benefit link. No Dynamo invitations. */
import { sendPurchaseInvitationEmail } from '../../src/lib/renaserInvitations/send-purchase-invitation-email';
import { normalizeInvitationEmail } from '../../src/lib/renaserInvitations/email';
import { PURCHASE_INVITATION_SUBJECT } from '../../src/lib/renaserInvitations/invitation-email-template';
import { getSharedBenefitToken } from '../../src/lib/renaserBenefit/config';

const PILOTS = [
  { email: 'rrnicolas31333@gmail.com', firstName: 'Nicolas' },
  { email: 'skillcert.technologies@gmail.com', firstName: 'SkillCert' },
] as const;

function maskMessageId(id: string): string {
  if (id.length <= 12) return `${id.slice(0, 4)}…`;
  return `${id.slice(0, 8)}…${id.slice(-4)}`;
}

async function main() {
  if (!getSharedBenefitToken()) {
    console.log(JSON.stringify({ ok: false, error: 'RENASER_SHARED_BENEFIT_TOKEN missing' }));
    process.exit(2);
  }

  const results = [];
  for (const pilot of PILOTS) {
    const emailNormalized = normalizeInvitationEmail(pilot.email);
    const sendResult = await sendPurchaseInvitationEmail({
      emailNormalized,
      firstName: pilot.firstName,
    });
    results.push({
      email: emailNormalized,
      sesSend: sendResult.sent ? 'YES' : 'NO',
      sesMessageIdMasked: sendResult.sent ? maskMessageId(sendResult.messageId) : undefined,
      errorCode: sendResult.sent ? undefined : sendResult.errorCode,
    });
  }

  const sent = results.filter((r) => r.sesSend === 'YES').length;
  console.log(
    JSON.stringify({
      ok: sent === 2,
      model: 'SHARED_PRIVATE_LINK',
      emailSubject: PURCHASE_INVITATION_SUBJECT,
      emailsSentThisRun: sent,
      sharedLinkPerEmail: 'SAME',
      dynamoInvitations: 'NO',
      pilots: results,
    }),
  );
  process.exit(sent === 2 ? 0 : 1);
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: String(e).slice(0, 200) }));
  process.exit(1);
});
