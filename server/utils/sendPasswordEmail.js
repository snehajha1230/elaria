import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Use the same transporter configuration as your working email function
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Consistent with your other email function
    pass: process.env.EMAIL_PASS,  // Consistent with your other email function
  },
});

const sendPasswordEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: `Elaria Support <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Elaria Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset</h2>
        <p>You requested to reset your password for your Elaria account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 10px 20px; 
                  background-color: #000; color: #fff; 
                  text-decoration: none; border-radius: 4px; 
                  margin: 20px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          ${resetUrl}
        </p>
      </div>
    `,
  };

  try {
    // Using the same pattern as your working emergency email function
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export default sendPasswordEmail;