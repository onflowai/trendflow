import dotenv from 'dotenv';
dotenv.config();
import { sendTestEmail } from './emailService.js';
/**
 * EMAIL TEST
 */
const emailData = {
  from: process.env.NO_REPLY_EMAIL, // NOTE must be allowed in SES
  to: process.env.RECIPIENT_TEST_EMAIL,
  subject: 'Real Test Email from TrendFlow',
  text: 'Trendflow local environment email test!',
};

sendTestEmail(emailData)
  .then((info) => {
    console.log('Email sent successfully!', info);
  })
  .catch((error) => {
    console.error('Error sending email:', error);
  });
