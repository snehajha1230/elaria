// controllers/helperController.js
import Helper from '../models/Helper.js';

export const applyAsHelper = async (req, res) => {
  try {
    const { role, bio } = req.body;

    const alreadyApplied = await Helper.findOne({ user: req.userId });
    if (alreadyApplied) return res.status(400).json({ message: 'You already applied as a helper' });

    const helper = await Helper.create({
      user: req.userId,
      role,
      bio
    });

    res.status(201).json(helper);
  } catch (err) {
    res.status(500).json({ message: 'Failed to apply as helper' });
  }
};

export const getAllVerifiedHelpers = async (req, res) => {
  try {
    const helpers = await Helper.find({ verified: true }).populate('user', 'name');
    res.json(helpers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch helpers' });
  }
};

export const getHelperById = async (req, res) => {
  try {
    const helper = await Helper.findById(req.params.id).populate('user', 'name');
    if (!helper) return res.status(404).json({ message: 'Helper not found' });
    res.json(helper);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch helper profile' });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const helper = await Helper.findOne({ user: req.userId });
    if (!helper) return res.status(404).json({ message: 'Not a helper' });

    helper.available = !helper.available;
    await helper.save();
    res.json(helper);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update availability' });
  }
};
