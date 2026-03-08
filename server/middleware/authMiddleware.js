import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export const protect = async (req, res, next) => {
  // 1. Check for token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Unauthorized: No token provided' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user and attach to request
    const user = await User.findById(decoded.userId || decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Unauthorized: User not found' 
      });
    }

    // 4. Attach both userId and full user object
    req.userId = decoded.userId || decoded.id; // For backward compatibility
    req.user = user; // For friends system
    
    next();
  } catch (err) {
    console.error('Authentication Error:', err);
    
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Session expired. Please login again.' 
      });
    }
    
    return res.status(401).json({ 
      message: 'Unauthorized: Invalid token' 
    });
  }
};

export default protect;