//models/chatRequest.js
import mongoose from 'mongoose';

const chatRequestSchema = new mongoose.Schema({
  helper: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Helper', 
    required: true 
  },
  requester: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  respondedAt: Date
});

export default mongoose.model('ChatRequest', chatRequestSchema);