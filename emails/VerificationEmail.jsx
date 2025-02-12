import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
} from '@react-email/components';

/**
 * Verification email in html NOTE: after each change need to build js version run: npm run build:emails
 * @param {Object} options - includes verificationToken, verificationCode
 * @returns {Object} object containing { subject, html } for the email
 */
export const VerificationEmail = ({
  verificationToken,
  verificationCode,
  baseURL,
}) => {
  const url = baseURL;
  const token = verificationToken || 'generatedTokenPlaceholder';
  const verificationLink = `${url}/verify-email?token=${token}`;
  return (
    <Html>
      <Head />
      <Preview>Verify your TrendFlow email</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Section style={sectionStyle}>
            <Text style={headingStyle}>Welcome to TrendFlow!</Text>
            <Text>
              Please verify your email by clicking this link:
              <Link href={verificationLink}>Verify Email</Link>
            </Text>
            <Text>
              Or use this 6-digit code: <strong>{verificationCode}</strong>
            </Text>
            <Text>This link/code will expire in 15 minutes.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;

const mainStyle = {
  backgroundColor: '#f9f9f9',
  fontFamily: 'sans-serif',
};

const containerStyle = {
  margin: '40px auto',
  padding: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  maxWidth: '600px',
};

const sectionStyle = {
  margin: '20px',
};

const headingStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
};
