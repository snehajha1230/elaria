import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: String,
  phone: String,
  email: String,
});

export default mongoose.model('EmergencyContact', contactSchema);
