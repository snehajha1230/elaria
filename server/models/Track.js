import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    artist: { 
      type: String, 
      trim: true, 
      default: '' 
    },
    coverUrl: {
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
    coverImage: {
      type: String, // This will store the file path for uploaded images
      trim: true,
    },
    trackUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Allow empty string if audioFile is uploaded instead
          if (!v) return true;
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Invalid track URL',
      },
    },
    audioFile: {
      type: String, // This will store the file path for uploaded audio files
      trim: true,
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Add a virtual for getting the cover URL (either from URL or uploaded file)
trackSchema.virtual('cover').get(function() {
  if (this.coverUrl) return this.coverUrl;
  if (this.coverImage) return `${process.env.BASE_URL}/uploads/covers/${this.coverImage}`;
  return null;
});

// Add a virtual for getting the track URL (either from URL or uploaded file)
trackSchema.virtual('track').get(function() {
  if (this.trackUrl) return this.trackUrl;
  if (this.audioFile) return `${process.env.BASE_URL}/uploads/audio/${this.audioFile}`;
  return null;
});

// Ensure virtuals are included when converting to JSON
trackSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Track', trackSchema);