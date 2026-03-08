import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, minlength: 6 },
    googleId: { type: String, unique: true, sparse: true },
    age: { type: Number, min: 0 },
    username: { 
      type: String, 
      unique: true, 
      trim: true,
      sparse: true
    },
      resetPasswordToken: String,
  resetPasswordExpires: Date,
    authMethod: { type: String, enum: ['local', 'google'], default: 'local' },
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
    
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export default mongoose.model("User", userSchema);
