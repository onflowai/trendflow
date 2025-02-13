import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
import { verificationEmailBuild } from './verificationEmailBuild.js';

const transporter = nodemailer.createTransport({
  host: process.env.AWS_SES_HOST,
  port: process.env.AWS_SES_PORT || 587, // or 465 for secure SSL connections
  secure: process.env.AWS_SES_PORT == 465, // true for port 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.AWS_SES_SMTP_USER, // SMTP username
    pass: process.env.AWS_SES_SMTP_PASS, // SMTP password
  },
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
export const sendVerificationEmail = async (user) => {
  const { subject, html } = verificationEmailBuild({
    verificationToken,
    verificationCode,
  });

  const mailOptions = {
    from: 'no-reply@trendflowai.com',
    to: user.email,
    subject,
    html: emailHtml,
  };
  console.log(html);

  return sendEmail(mailOptions);
};

export const sendTestEmail = sendEmail; // export sendEmail as sendTestEmail for testing purposes
export { transporter };
