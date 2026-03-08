import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import session from 'express-session';
import './config/passport.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import trackRoutes from './routes/trackRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import poemRoutes from './routes/poemRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import diagnoseRoutes from './routes/diagnoseRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import sosRoutes from './routes/sosRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import helperRoutes from './routes/helperRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import diaryRoutes from './routes/diaryRoutes.js';


dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.IO Setup (with proper CORS)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Log CORS origin
console.log('CORS allowed origin:', process.env.CLIENT_URL || 'http://localhost:5173');

// === Socket.IO Events ===
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // User-specific room (e.g., notifications)
  socket.on('joinUserRoom', (userId) => {
    if (userId) {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined room: user-${userId}`);
    }
  });

  // Join Chat
  socket.on('joinChat', (data) => {
    const chatId = data.chatId || data;
    if (chatId) {
      socket.join(`chat-${chatId}`);
      console.log(`Socket ${socket.id} joined chat room: chat-${chatId}`);
    }
  });


  socket.on('leaveChat', (chatId) => {
    if (chatId) {
      socket.leave(`chat-${chatId}`);
      console.log(`🚪 Socket ${socket.id} left chat room: chat-${chatId}`);
    }
  });


  socket.on('typing', ({ chatId, userId, userName }) => {
    if (chatId && userId) {
      socket.to(`chat-${chatId}`).emit('userTyping', { chatId, userId, userName });
    }
  });

  // Send Message
  socket.on('sendMessage', ({ chatId, message }) => {
    if (chatId && message) {
      io.to(`chat-${chatId}`).emit('newMessage', { chatId, message });
      console.log(`Message sent to chat-${chatId}:`, message);
    }
  });

  // Error + Disconnect
  socket.on('error', (err) => {
    console.error(`Socket error (${socket.id}):`, err);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected (${socket.id}): ${reason}`);
  });
});

// === API Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/poems', poemRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/diagnose', diagnoseRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/helpers', helperRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/diary', diaryRoutes);
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



// === MongoDB & Server Start ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5001;
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Export socket instance
export { io };
