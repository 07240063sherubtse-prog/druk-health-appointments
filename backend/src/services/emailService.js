import { env } from '../config/env.js';

async function sendBrevoEmail({ to, subject, text, html }) {
  if (!env.EMAIL_API_KEY) {
    if (env.NODE_ENV === 'production') {
      throw new Error('Email delivery is not configured.');
    }

    console.log('EMAIL LOG:', { to, subject, text, html });
    return { success: true, mode: 'console' };
  }

  if (!env.EMAIL_FROM) {
    throw new Error('Email delivery is not configured: set EMAIL_FROM to a verified Brevo sender address.');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.EMAIL_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'Druk Health Appointments', email: env.EMAIL_FROM },
      to: [{ email: to }],
      subject,
      htmlContent: html || `<p>${text}</p>`,
      textContent: text,
    }),
  });

  if (!response.ok) {
    const hint = response.status === 401 || response.status === 403
      ? ' Check BREVO_API_KEY.'
      : response.status === 400
        ? ' Check that EMAIL_FROM is verified in Brevo and the recipient address is valid.'
        : '';
    throw new Error(`Brevo email delivery failed with HTTP ${response.status}.${hint}`);
  }

  return { success: true, mode: 'brevo' };
}

export const emailService = {
  async sendVerificationEmail({ email, token }) {
    const link = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    return sendBrevoEmail({
      to: email,
      subject: 'Verify your Druk Health Appointments account',
      text: `Verify your account here: ${link}`,
      html: `<p>Verify your account here:</p><p><a href="${link}">${link}</a></p>`,
    });
  },
  async sendPasswordResetEmail({ email, token }) {
    const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    return sendBrevoEmail({
      to: email,
      subject: 'Reset your Druk Health Appointments password',
      text: `Reset your password here: ${link}`,
      html: `<p>Reset your password here:</p><p><a href="${link}">${link}</a></p>`,
    });
  },
  async sendAppointmentEmail({ email, title, text, html }) {
    return sendBrevoEmail({
      to: email,
      subject: title,
      text,
      html,
    });
  },
};
