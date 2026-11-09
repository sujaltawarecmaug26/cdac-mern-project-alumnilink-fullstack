import nodemailer from 'nodemailer';
import env from './env.js';

const smtpConfigured = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

let transporter = null;

if (smtpConfigured) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}

 

export { transporter, smtpConfigured };
