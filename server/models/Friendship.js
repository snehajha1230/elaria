import mongoose from 'mongoose';

const friendshipSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    }
  }
});

// Compound index for unique friendships
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Virtual for population
friendshipSchema.virtual('requesterInfo', {
  ref: 'User',
  localField: 'requester',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name username profilePic' }
});

friendshipSchema.virtual('recipientInfo', {
  ref: 'User',
  localField: 'recipient',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name username profilePic' }
});

const Friendship = mongoose.model('Friendship', friendshipSchema);
export default Friendship;