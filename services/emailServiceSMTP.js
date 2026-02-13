import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
import { verificationEmailBuild } from './verificationEmailBuild.js';
/**
 * 
 */
const sesPort = Number(process.env.AWS_SES_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.AWS_SES_HOST,
  port: sesPort,
  secure: sesPort === 465, // true for port 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.AWS_SES_SMTP_USER, // SMTP username
    pass: process.env.AWS_SES_SMTP_PASS, // SMTP password
  },
  connectionTimeout: 10_000,//fail fast
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
}); // configure the transporter using environment variables

/**
 * Generic email function to send an email
 * @param {Object} mailOptions - contains keys like from, to, subject, text
 */
export const sendEmail = async (mailOptions) => {
  return transporter.sendMail(mailOptions);
};

/**
 * Sends a verification email to the user
 * @param {Object} user - The user object should include email and verificationCode
 */
export const sendVerificationEmail = async ({
  email,
  verificationToken,
  verificationCode,
}) => {
  const { subject, html } = await verificationEmailBuild({
    verificationToken,
    verificationCode,
  });

  const mailOptions = {
    from: 'no-reply@trendflowai.com',
    to: email,
    subject,
    html,
  };

  return sendEmail(mailOptions);
};

export const sendTestEmail = sendEmail; // export sendEmail as sendTestEmail for testing purposes
export { transporter };
