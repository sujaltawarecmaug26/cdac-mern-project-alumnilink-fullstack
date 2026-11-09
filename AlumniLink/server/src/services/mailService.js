import env from '../config/env.js';
import { transporter, smtpConfigured } from '../config/mail.js';

const theme = { primary: '#9F1239', cream: '#FFF8F1', text: '#2B1B17' };

function wrapHtml(title, body) {
  return `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;background:${theme.cream};padding:24px;color:${theme.text}">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:24px;border:1px solid #F1E3D3">
    <h1 style="color:${theme.primary};font-size:20px;margin:0 0 12px">${title}</h1>
    ${body}
    <p style="margin-top:24px;font-size:12px;color:#8B7766">AlumniLink · Placement & Alumni Relations</p>
  </div></body></html>`;
}

export const mailService = {
  async passwordReset({ user, resetUrl }) {
    const payload = {
      from: env.mailFrom,
      to: user.email,
      subject: 'AlumniLink — reset your password',
      html: wrapHtml('Password reset', `<p>Hi ${user.name},</p><p>Use this link within 30 minutes:</p><p><a href="${resetUrl}" style="color:${theme.primary}">${resetUrl}</a></p>`),
    };
    if (!smtpConfigured || !transporter) {
      console.log('[mail:console]', { to: user.email, subject: payload.subject, resetUrl });
      return { console: true };
    }
    return transporter.sendMail(payload);
  },
};
