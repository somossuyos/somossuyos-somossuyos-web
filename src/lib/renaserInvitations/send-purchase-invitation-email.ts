import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { GetSuppressedDestinationCommand, SESv2Client } from '@aws-sdk/client-sesv2';
import {
  buildPurchaseInvitationEmail,
  PURCHASE_INVITATION_SUBJECT,
} from './invitation-email-template';

const FROM =
  process.env.RENASER_INVITATION_FROM?.trim() ||
  'RenaSER 2026 <contacto@somossuyos.com>';
const CONFIG_SET =
  process.env.RENASER_SES_CONFIGURATION_SET?.trim() || 'RenaSERTransactional';

let ses: SESClient | null = null;
let sesv2: SESv2Client | null = null;

function getSes(): SESClient {
  if (!ses) {
    const region =
      process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim() || 'us-east-1';
    ses = new SESClient({ region });
  }
  return ses;
}

function getSesV2(): SESv2Client {
  if (!sesv2) {
    const region =
      process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim() || 'us-east-1';
    sesv2 = new SESv2Client({ region });
  }
  return sesv2;
}

export async function isEmailSuppressed(emailNormalized: string): Promise<boolean> {
  try {
    await getSesV2().send(
      new GetSuppressedDestinationCommand({ EmailAddress: emailNormalized }),
    );
    return true;
  } catch {
    return false;
  }
}

export type SendPurchaseInvitationResult =
  | { sent: true; messageId: string }
  | { sent: false; errorCode: string };

/** Sends one purchase invitation (token must not be logged). */
export async function sendPurchaseInvitationEmail(params: {
  emailNormalized: string;
  firstName: string;
  token: string;
}): Promise<SendPurchaseInvitationResult> {
  if (await isEmailSuppressed(params.emailNormalized)) {
    return { sent: false, errorCode: 'suppressed' };
  }

  const { html, text } = buildPurchaseInvitationEmail({
    firstName: params.firstName,
    token: params.token,
  });

  try {
    const out = await getSes().send(
      new SendEmailCommand({
        Source: FROM,
        Destination: { ToAddresses: [params.emailNormalized] },
        Message: {
          Subject: { Data: PURCHASE_INVITATION_SUBJECT, Charset: 'UTF-8' },
          Body: {
            Html: { Data: html, Charset: 'UTF-8' },
            Text: { Data: text, Charset: 'UTF-8' },
          },
        },
        ConfigurationSetName: CONFIG_SET,
      }),
    );
    const messageId = out.MessageId?.trim();
    if (!messageId) return { sent: false, errorCode: 'missing_message_id' };
    return { sent: true, messageId };
  } catch {
    return { sent: false, errorCode: 'ses_send_failed' };
  }
}
