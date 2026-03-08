import EmergencyContact from '../models/EmergencyContact.js';

export const addContact = async (req, res) => {
  try {
    const userId = req.userId;

    const existing = await EmergencyContact.find({ user: userId });
    if (existing.length >= 4) {
      return res.status(400).json({ message: 'Maximum 4 contacts allowed' });
    }

    const newContact = new EmergencyContact({ user: userId, ...req.body });
    await newContact.save();

    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add contact' });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ user: req.userId });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    if (contact.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await contact.deleteOne();
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error('❌ Delete contact error:', err);
    res.status(500).json({ message: 'Failed to delete contact' });
  }
};
