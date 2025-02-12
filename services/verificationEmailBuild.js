import React from 'react';
import { render } from '@react-email/render';
import VerificationEmail from '../dist/emails/VerificationEmail.js'; // compiled component in dist

export const verificationEmailBuild = async (options) => {
  const { verificationToken, verificationCode } = options;

  const baseURL = process.env.PROD_URL;
  const subject = 'Verify Your TrendFlow Email';

  const element = React.createElement(VerificationEmail, {
    verificationToken,
    verificationCode,
    baseURL,
  });

  const html = await render(element);
  return { subject, html };
};
