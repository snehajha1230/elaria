import EmergencyContact from '../models/EmergencyContact.js';
import User from '../models/User.js';
import { sendEmergencyEmail } from '../utils/sendEmail.js';
import { sendEmergencySMS } from '../utils/sendSMS.js';
import { sendEmergencyWhatsApp } from '../utils/sendWhatsApp.js';

export const triggerSOS = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ user: req.userId });
    const user = await User.findById(req.userId);

    if (!contacts.length) {
      return res.status(400).json({ message: 'No emergency contacts found' });
    }

    const results = [];

    for (const contact of contacts) {
      const emailResult = contact.email ? await sendEmergencyEmail(contact.email, user.name || 'Your friend') : null;
      const smsResult = contact.phone ? await sendEmergencySMS(contact.phone, user.name || 'Your friend') : null;
      const whatsappResult = contact.phone ? await sendEmergencyWhatsApp(contact.phone, user.name || 'Your friend') : null;

      results.push({
        email: contact.email || null,
        sms: contact.phone || null,
        whatsapp: contact.phone || null,
        emailStatus: emailResult?.accepted || null,
        smsStatus: smsResult || null,
        whatsappStatus: whatsappResult || null,
      });
    }

    res.status(200).json({ message: 'SOS triggered: Email, SMS, WhatsApp sent.', results });
  } catch (err) {
    console.error('❌ SOS trigger error:', err);
    res.status(500).json({ message: 'Failed to trigger SOS' });
  }
};
