// backend/models/ChatSession.js
import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  request: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ChatRequest', 
    required: true 
  },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: ['helper', 'requester'], required: true }
    }
  ],
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  status: { 
    type: String, 
    enum: ['active', 'closed'], 
    default: 'active' 
  }
}, { timestamps: true });

export default mongoose.model('ChatSession', chatSessionSchema);