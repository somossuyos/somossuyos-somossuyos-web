import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { buildRenaserInvitationEmail } from './emailTemplate';

export type SendInvitationEmailParams = {
  to: string;
  firstName: string;
  invitationUrl: string;
  dryRun: boolean;
};

export type SendInvitationEmailResult =
  | { ok: true; dryRun: true }
  | { ok: true; dryRun: false; messageId: string }
  | { ok: false; error: string };

function getSesClient(): SESv2Client {
  const region =
    process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim() || 'us-east-1';
  return new SESv2Client({ region });
}

export async function sendRenaserInvitationEmail(
  params: SendInvitationEmailParams,
): Promise<SendInvitationEmailResult> {
  const content = buildRenaserInvitationEmail({
    firstName: params.firstName,
    invitationUrl: params.invitationUrl,
  });

  if (params.dryRun) {
    return { ok: true, dryRun: true };
  }

  const from =
    process.env.RENASER_INVITATION_FROM?.trim() || 'RenaSER 2026 <contacto@somossuyos.com>';
  const configSet = process.env.RENASER_SES_CONFIGURATION_SET?.trim() || 'RenaSERTransactional';

  try {
    const out = await getSesClient().send(
      new SendEmailCommand({
        FromEmailAddress: from,
        Destination: { ToAddresses: [params.to] },
        ConfigurationSetName: configSet,
        Content: {
          Simple: {
            Subject: { Data: content.subject, Charset: 'UTF-8' },
            Body: {
              Html: { Data: content.html, Charset: 'UTF-8' },
              Text: { Data: content.text, Charset: 'UTF-8' },
            },
          },
        },
      }),
    );
    return { ok: true, dryRun: false, messageId: out.MessageId ?? 'unknown' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'ses_send_failed';
    return { ok: false, error: msg.slice(0, 200) };
  }
}
