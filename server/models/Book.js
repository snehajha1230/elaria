import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  author: { 
    type: String,
    trim: true,
    default: ''
  },
  genre: { 
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
  bookUrl: { 
    type: String,
    validate: {
      validator: url => /^https?:\/\/.+/.test(url),
      message: 'Invalid book URL'
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Book', bookSchema);
