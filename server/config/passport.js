import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://elaria-server.onrender.com/api/auth/google/callback',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Find existing user by email or Google ID
    let user = await User.findOne({ 
      $or: [
        { email: profile.emails[0].value },
        { googleId: profile.id }
      ]
    });

    if (!user) {
      // New Google user
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        authMethod: 'google'
      });
      await user.save();
    } else {
      // Existing user — update Google ID & authMethod if missing
      if (!user.googleId) user.googleId = profile.id;
      user.authMethod = 'google'; // Force set to avoid login error
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

export default passport;
