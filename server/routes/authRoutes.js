import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import passport from "passport";
import "../config/passport.js";
import crypto from "crypto";
import sendPasswordEmail from "../utils/sendPasswordEmail.js";

dotenv.config();

const router = express.Router();

// Google OAuth routes
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account"
}));

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user, info) => {
    if (err || !user) {
      console.error("Google login failed:", err || "No user returned");
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Redirect based on profile completion
      if (!user.username || !user.age) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/complete-profile?token=${token}`
        );
      }

      return res.redirect(
        `${process.env.FRONTEND_URL}/oauth-callback?token=${token}`
      );

    } catch (e) {
      console.error("Token generation error:", e);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next);
});


// Profile completion route
router.post("/complete-profile", async (req, res) => {
  try {
    const { token, username, age } = req.body;
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if username is available
    const existingUser = await User.findOne({ 
      username,
      _id: { $ne: user._id } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }
    
    // Update user profile
    user.username = username;
    user.age = age;
    await user.save();
    
    // Return new token
    const newToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.status(200).json({ 
      token: newToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        age: user.age
      }
    });
  } catch (err) {
    console.error("Profile completion error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        age: user.age,
        authMethod: user.authMethod
      }
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Username availability check
router.get("/check-username", async (req, res) => {
  try {
    const { username } = req.query;
    if (!username || username.length < 3) {
      return res.json({ available: false, message: "Username must be at least 3 characters" });
    }
    
    const user = await User.findOne({ username });
    res.json({ 
      available: !user,
      message: user ? "Username already taken" : "Username available"
    });
  } catch (err) {
    res.status(500).json({ message: "Error checking username" });
  }
});

// Keep your existing SIGNUP and LOGIN routes
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, age, username } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Check username availability
    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return res.status(400).json({ message: "Username already taken." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      username,
    });
    await newUser.save();

    // Create token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        age: newUser.age,
      },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Handle Google-authenticated users
    if (user.authMethod === 'google') {
      return res.status(400).json({ 
        message: "This account was created with Google. Please use Google Sign-In." 
      });
    }

    // Handle regular users without password (shouldn't happen for non-Google users)
    if (!user.password) {
      return res.status(400).json({ 
        message: "Please reset your password or use Google Sign-In." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        age: user.age,
        email: user.email,
        authMethod: user.authMethod // Include auth method in response
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    await sendPasswordEmail(user.email, resetToken);

    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error sending reset email' });
  }
});


// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
});

export default router;