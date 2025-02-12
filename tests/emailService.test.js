import { jest } from '@jest/globals';

/**
 * JEST testing email sending ability
 */

jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: jest.fn(),
  }, // default export in ESM since nodemailer is imported as default in ESM
})); // using JEST unstable ESM mocking API to mock nodemailer

async function loadModules() {
  const nodemailer = await import('nodemailer'); // importing mocked nodemailer
  const sendMailMock = jest.fn().mockResolvedValue({ response: '250 OK' }); // mock for sendMail that resolves with a fake response
  nodemailer.default.createTransport.mockReturnValue({
    sendMail: sendMailMock,
  }); // configuring createTransport to return an object with our sendMail mock
  // Now dynamically import our email service module.
  const { sendTestEmail } = await import('../services/emailService.js');
  return { sendTestEmail, sendMailMock };
} // wrapping dynamic imports in an async function to keep mocks in place

describe('sendTestEmail', () => {
  let sendTestEmail;
  let sendMailMock;

  beforeAll(async () => {
    const modules = await loadModules();
    sendTestEmail = modules.sendTestEmail;
    sendMailMock = modules.sendMailMock;
  }); // loading modules before running tests

  it('should send an email with correct parameters', async () => {
    const emailData = {
      from: process.env.NO_REPLY_EMAIL,
      to: process.env.RECIPIENT_TEST_EMAIL,
      subject: 'Trendflow Dev Testing Team',
      text: 'Hello, this is a test email!',
    };

    const result = await sendTestEmail(emailData); // calling sendTestEmail (alias for sendEmail)

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(emailData);
    expect(result).toEqual({ response: '250 OK' });
  }); // verify that sendMail was called once with the correct email data
});
