import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String, // Movie / Series / Anime / etc.
      default: '',
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Allow empty string if coverImage is uploaded instead
          if (!v) return true;
          
          // Check if it's a valid URL with any extension or no extension
          try {
            const url = new URL(v);
            // Allow any valid URL regardless of file extension
            return url.protocol === 'http:' || url.protocol === 'https:';
          } catch (e) {
            return false;
          }
        },
        message: 'Invalid URL format. Please provide a valid HTTP/HTTPS URL.',
      },
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true, 
    },
  },
  { timestamps: true }
);

export default mongoose.model('Media', mediaSchema);
