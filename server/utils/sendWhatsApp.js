import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Formats phone number for India (country code 91)
 * @param {string} phone - Phone number in any format
 * @returns {string|null} - Formatted 12-digit number (91XXXXXXXXXX) or null if invalid
 */
const formatIndianPhoneNumber = (phone) => {
  // Remove all non-digit characters
  let cleanPhone = phone.toString().replace(/\D/g, '');
  
  // Always extract the last 10 digits for Indian mobile numbers
  if (cleanPhone.length >= 10) {
    const last10Digits = cleanPhone.slice(-10);
    
    // Validate: Indian mobile numbers start with 6, 7, 8, or 9
    if (/^[6-9]/.test(last10Digits)) {
      return `91${last10Digits}`;
    } else {
      console.error(`Invalid Indian mobile number: ${phone} (must start with 6, 7, 8, or 9)`);
      return null;
    }
  } else {
    console.error(`Phone number too short: ${phone} -> ${cleanPhone}`);
    return null;
  }
};

/**
 * Sends emergency WhatsApp message using Ultramsg
 * Ultramsg is easy to use and doesn't require recipients to initiate conversation
 * Register at: https://ultramsg.com/
 * 
 * @param {string} phone - Phone number (without country code)
 * @param {string} userName - Name of the user in distress
 * @returns {Promise<Object|null>} - API response or null on error
 */
export const sendEmergencyWhatsApp = async (phone, userName = 'Your friend') => {
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
  const token = process.env.ULTRAMSG_TOKEN;
  
  // Validate environment variables
  if (!instanceId || !token) {
    console.error('Ultramsg credentials not configured. Please set ULTRAMSG_INSTANCE_ID and ULTRAMSG_TOKEN in .env');
    return null;
  }

  // Format phone number for India
  const phoneNumber = formatIndianPhoneNumber(phone);
  if (!phoneNumber) return null;

  const message = `🚨 *SOS ALERT*\n\n${userName} may be in distress and needs your help immediately.\n\nPlease check on them as soon as possible.\n\n- Elaria Support Team`;

  try {
    // Ultramsg API format: https://api.ultramsg.com/{instance_id}/messages/chat
    const response = await axios.post(
      `https://api.ultramsg.com/${instanceId}/messages/chat`,
      {
        token: token,
        to: phoneNumber,
        body: message
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Ultramsg returns different response formats, check for success
    if (response.data) {
      // Check for success indicators
      if (response.data.sent === 'true' || response.data.sent === true || 
          response.data.id || response.data.messageId || 
          response.data.status === 'sent' || response.data.status === 'success') {
        console.log(`WhatsApp sent successfully to ${phoneNumber}`);
        return { success: true, messageId: response.data.id || response.data.messageId };
      }
      
      // Log response for debugging
      console.log(`⚠️ Ultramsg response:`, JSON.stringify(response.data, null, 2));
    }
    
    return response.data;
  } catch (error) {
    console.error(`Ultramsg WhatsApp Error for ${phoneNumber}:`);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Error:', error.message);
    }
    return null;
  }
};
