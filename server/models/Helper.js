// models/Helper.js
import mongoose from 'mongoose';

const helperSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['Listener', 'Psychology Student', 'Professional'], required: true },
  bio: { type: String, required: true },
  available: { type: Boolean, default: true },
  verified: { type: Boolean, default: true }, // Admin will verify
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Helper', helperSchema);
