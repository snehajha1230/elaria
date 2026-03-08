import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmergencySMS = async (phone, userName = 'Your friend') => {
  const apiKey = process.env.MSG91_AUTH_KEY;
  const senderId = process.env.MSG91_SENDER_ID;
  const message = `🚨 SOS ALERT: ${userName} may need your help. Please check on them immediately.`;

  try {
    const response = await axios.post(
      'https://control.msg91.com/api/v5/message?country=91&route=4', 
      {
        sms: [
          {
            message,
            to: [phone],
          },
        ],
        sender: senderId,
      },
      {
        headers: {
          authkey: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('MSG91 SMS Error:', error?.response?.data || error);
    return null;
  }
};
