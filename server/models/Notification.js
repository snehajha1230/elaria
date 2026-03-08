import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRequest'
  },
  relatedChat: { 
  type: mongoose.Schema.Types.ObjectId,
  ref: 'ChatSession'
},
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['request', 'accept', 'decline', 'message'],
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;