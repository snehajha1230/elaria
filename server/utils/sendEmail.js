import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmergencyEmail = async (to, userName = 'Your friend') => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: '🚨 SOS Alert from Elaria',
    html: `
      <h2>🚨 Emergency Alert</h2>
      <p><strong>${userName}</strong> may be in distress and needs your help.</p>
      <p>Please check on them immediately.</p>
      <hr />
      <p>Sent via <strong>Elaria</strong></p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
