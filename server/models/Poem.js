import mongoose from 'mongoose';

const poemSchema = new mongoose.Schema(
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
    author: String,
    linkUrl: {
      type: String,
      // No longer required since content can be provided instead
    },
    content: {
      type: String,
      // No longer required since linkUrl can be provided instead
    },
    isPublic: {
      type: Boolean,
      default: true, 
    },
  },
  { timestamps: true }
);

// Add a virtual for excerpt (first 150 characters of content)
poemSchema.virtual('excerpt').get(function() {
  if (this.content) {
    return this.content.length > 150 
      ? this.content.substring(0, 150) + '...' 
      : this.content;
  }
  return '';
});

// Ensure virtual fields are serialized when converting to JSON
poemSchema.set('toJSON', { virtuals: true });

const Poem = mongoose.model('Poem', poemSchema);
export default Poem;