import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { verificationEmailBuild } from './verificationEmailBuild.js';

const ses = new SESv2Client({
  region: process.env.AWS_REGION || 'us-east-2'
});

export const sendVerificationEmail = async ({
  email,
  verificationToken,
  verificationCode,
}) => {
  const { subject, html } = await verificationEmailBuild({
    verificationToken,
    verificationCode,
  });

  const cmd = new SendEmailCommand({
    FromEmailAddress: process.env.NO_REPLY_EMAIL || 'no-reply@trendflowai.com',
    Destination: { ToAddresses: [email] },
    Content: {
      Simple: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: { Html: { Data: html, Charset: 'UTF-8' } },
      },
    },
  });

  return ses.send(cmd);
};