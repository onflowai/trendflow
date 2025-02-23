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
  Img,
} from '@react-email/components';

export const VerificationEmail = ({
  verificationToken,
  verificationCode,
  baseURL,
}) => {
  const token = verificationToken || 'generatedTokenPlaceholder';
  const verificationLink = `${baseURL}/verify-email?token=${token}`;

  return (
    <Html>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https://cdn.trendflowai.com data:;"
        />
        <style>{`
          /* Additional inline CSS resets if needed */
        `}</style>
      </Head>
      <Preview>Verify your TrendFlow email</Preview>
      <Body style={bodyStyle}>
        <Container style={outerContainerStyle}>
          <Section style={headerStyle}>
            <Img
              src="https://cdn.trendflowai.com/emails/logo.png"
              alt="TrendFlow Logo"
              width="30"
              style={headerLogoStyle}
            />
            <Text style={headerTextStyle}>trendflow team</Text>
          </Section>
          <Section style={contentSectionStyle}>
            <Text style={welcomeTextStyle}>
              Welcome to <span style={gradientTextStyle}>TrendFlow!</span>
            </Text>
            <Text style={explanationTextStyle}>
              You are receiving this email because a request was made for a
              one-time code that can be used for authentication.
            </Text>
            <Section style={codeSectionContainerStyle}>
              <Text style={codeBoxStyle}>{verificationCode}</Text>
            </Section>
            <Section style={verifyLinkSectionStyle}>
              <Text style={explanationTextStyle}>
                You can verify your email using trendflow email verification
                link:
              </Text>
              <Link href={verificationLink} style={verifyButtonStyle}>
                Verify Email
              </Link>
            </Section>
            <Text style={footerTextStyle}>
              If you did not request this change, please change your password or
              use the chat in the Atlas user interface to contact us.
            </Text>
          </Section>
          <Section style={signatureStyle}>
            <Img
              src="https://cdn.trendflowai.com/emails/logo.png"
              alt="TrendFlow Logo"
              width="20"
              style={signatureLogoStyle}
            />
            <Text style={signatureTextStyle}>trendflow team</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;

// ==================
// Inline Styles
// ==================

const bodyStyle = {
  margin: 0,
  padding: 0,
  backgroundColor: '#f9f9f9',
  fontFamily: 'sans-serif',
};

const outerContainerStyle = {
  margin: '40px auto',
  padding: '20px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  paddingBottom: '10px',
  borderBottom: '1px solid #ddd',
  marginBottom: '20px',
};

const headerLogoStyle = {
  marginRight: '10px',
};

const headerTextStyle = {
  fontSize: '14px',
  textTransform: 'lowercase',
  color: '#333',
};

const contentSectionStyle = {
  padding: '0 20px',
};

const welcomeTextStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '16px',
};

const gradientTextStyle = {
  background: 'linear-gradient(90deg, #ff7e5f, #feb47b)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const explanationTextStyle = {
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '16px',
  color: '#555',
};

const codeSectionContainerStyle = {
  textAlign: 'center',
  marginBottom: '20px',
};

const codeBoxStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f0f0f0',
  fontSize: '18px',
  fontWeight: 'bold',
};

const verifyLinkSectionStyle = {
  textAlign: 'left',
  marginBottom: '20px',
};

const verifyButtonStyle = {
  display: 'inline-block',
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
  textDecoration: 'none',
  border: '1px solid #ccc',
  borderRadius: '20px',
  whiteSpace: 'nowrap',
  marginTop: '10px',
};

const footerTextStyle = {
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '20px',
  color: '#777',
};

const signatureStyle = {
  display: 'flex',
  alignItems: 'center',
  borderTop: '1px solid #ddd',
  paddingTop: '10px',
  marginTop: '20px',
};

const signatureLogoStyle = {
  marginRight: '8px',
};

const signatureTextStyle = {
  fontSize: '12px',
  color: '#555',
  textTransform: 'lowercase',
};
