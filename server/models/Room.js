import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  roomId: {
    type: String,
    required: true,
    enum: ['music', 'cinema', 'poetry', 'library', 'release', 'diary']
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    }
  }
});

// Compound index to ensure one roomId per user
roomSchema.index({ userId: 1, roomId: 1 }, { unique: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;