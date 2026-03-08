import mongoose from 'mongoose';
import ChatRequest from '../models/ChatRequest.js';
import ChatSession from '../models/ChatSession.js';
import Helper from '../models/Helper.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { io } from '../server.js';

// Request a chat
export const requestChat = async (req, res) => {
  try {
    const { helperId } = req.body;

    if (!helperId) {
      return res.status(400).json({ success: false, message: 'Helper ID is required' });
    }

    const helper = await Helper.findById(helperId).populate('user', 'name');
    if (!helper || !helper.available) {
      return res.status(400).json({ success: false, message: 'Helper not available' });
    }

    const request = await ChatRequest.create({
      helper: helperId,
      requester: req.userId,
      status: 'pending'
    });

    const populatedRequest = await ChatRequest.findById(request._id)
      .populate('requester', 'name email')
      .populate('helper', 'user available')
      .lean();

    await Notification.create({
      recipient: helper.user._id,
      relatedRequest: request._id,
      message: `Check your chat requests, you might have a incoming request from ${populatedRequest.requester.name}`,
      type: 'request'
    });

    io.to(`user-${helper.user._id}`).emit('newRequest', populatedRequest);
    io.to(`user-${req.userId}`).emit('requestStatus', {
      status: 'pending',
      requestId: request._id
    });

    res.status(201).json({ success: true, data: populatedRequest });
  } catch (err) {
    console.error('Chat request error:', err);
    res.status(500).json({ success: false, message: 'Failed to create chat request' });
  }
};

// Helper fetches their pending requests
export const getHelperRequests = async (req, res) => {
  try {
    const helper = await Helper.findOne({ user: req.userId });
    if (!helper) {
      return res.status(403).json({ success: false, message: 'Not a registered helper' });
    }

    const requests = await ChatRequest.find({ helper: helper._id, status: 'pending' })
      .populate('requester', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    console.error('Get requests error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch chat requests' });
  }
};

// Helper accepts or declines the request
export const respondToRequest = async (req, res) => {
  try {
    const { requestId, response } = req.body;

    if (!requestId || typeof response !== 'string') {
      return res.status(400).json({ success: false, message: 'Request ID and response are required' });
    }

    const request = await ChatRequest.findById(requestId)
      .populate('helper', 'user available')
      .populate('requester', 'name email avatar');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Chat request not found' });
    }

    const helper = await Helper.findOne({ user: req.userId }).populate('user', 'name email avatar');
    if (!helper || !request.helper._id.equals(helper._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to respond to this request' });
    }

    const isAccepted = response.toLowerCase() === 'accept';
    request.status = isAccepted ? 'accepted' : 'declined';
    request.respondedAt = new Date();

    let chatSession = null;

    if (isAccepted) {
      chatSession = await ChatSession.create({
        request: request._id,
        participants: [
          { user: request.requester._id, role: 'requester' },
          { user: helper.user._id, role: 'helper' }
        ],
        status: 'active'
      });

      chatSession = await ChatSession.findById(chatSession._id)
        .populate('participants.user', 'name email avatar')
        .lean();

      request.chatSession = chatSession._id;

      await Notification.create({
        recipient: request.requester._id,
        relatedRequest: request._id,
        relatedChat: chatSession._id,
        message: `${helper.user.name} accepted your chat request`,
        type: 'accept',
        metadata: {
          chatId: chatSession._id,
          helperName: helper.user.name
        }
      });

      io.to(`user-${request.requester._id}`).emit('requestUpdate', {
        request: request.toObject(),
        chatSession,
        type: 'accept',
        chatId: chatSession._id
      });

      io.to(`user-${helper.user._id}`).emit('chatStarted', {
        chatId: chatSession._id,
        requesterId: request.requester._id,
        requesterName: request.requester.name,
        participants: chatSession.participants
      });
    } else {
      await Notification.create({
        recipient: request.requester._id,
        relatedRequest: request._id,
        message: `It seems the helper ${helper.user.name} was unavailable at the moment and couldn’t accept your request. You’re welcome to try again shortly or reach out to someone else who’s available.`,
        type: 'decline'
      });
    }

    await request.save();

    const responseData = {
      request: request.toObject(),
      chatSession: isAccepted ? chatSession : null,
      helper: {
        _id: helper._id,
        name: helper.user.name
      }
    };

    io.to(`user-${request.requester._id}`).emit('requestUpdate', {
      ...responseData,
      type: 'accept',
      chatId: chatSession?._id
    });

    io.to(`user-${helper.user._id}`).emit('requestUpdate', {
      ...responseData,
      type: 'response',
      chatId: chatSession?._id
    });

    res.status(200).json({ success: true, data: responseData });
  } catch (err) {
    console.error('Respond to request error:', err);
    res.status(500).json({ success: false, message: 'Failed to process chat response' });
  }
};

// Fetch all active chat sessions for current user
export const getActiveChats = async (req, res) => {
  try {
    const activeChats = await ChatSession.find({
      'participants.user': req.userId,
      status: 'active'
    })
      .populate('participants.user', 'name email avatar')
      .populate({
        path: 'request',
        populate: {
          path: 'helper',
          select: 'user',
          populate: { path: 'user', select: 'name avatar' }
        }
      })
      .sort({ updatedAt: -1 })
      .lean();

    const formatted = activeChats.map(chat => ({
      ...chat,
      participants: chat.participants.map(p => ({
        _id: p.user._id,
        name: p.user.name,
        email: p.user.email,
        avatar: p.user.avatar,
        role: p.role
      }))
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    console.error('Get active chats error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch active chats' });
  }
};

// Fetch specific chat session
export const getChatSession = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ success: false, message: 'Valid chat ID is required' });
    }

    const chat = await ChatSession.findById(chatId)
      .populate('participants.user', 'name email avatar')
      .populate('messages.sender', 'name avatar');

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }

    const isParticipant = chat.participants.some(p => p.user._id.equals(req.userId));
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this chat' });
    }

    const responseData = {
      _id: chat._id,
      request: chat.request,
      participants: chat.participants.map(p => ({
        _id: p.user._id,
        name: p.user.name,
        email: p.user.email,
        avatar: p.user.avatar,
        role: p.role
      })),
      messages: chat.messages.map(m => ({
        _id: m._id,
        sender: {
          _id: m.sender._id,
          name: m.sender.name,
          avatar: m.sender.avatar
        },
        content: m.content,
        timestamp: m.timestamp,
        isOwn: m.sender._id.equals(req.userId)
      })),
      status: chat.status,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (err) {
    console.error('Get chat session error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch chat session' });
  }
};

// Send message inside chat session
export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { chatId } = req.params;

    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ success: false, message: 'Invalid chat ID' });
    }

    const chat = await ChatSession.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const isParticipant = chat.participants.some(p => p.user.equals(req.userId));
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not a chat participant' });
    }

    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      sender: req.userId,
      content: content.trim(),
      timestamp: new Date()
    };

    const updatedChat = await ChatSession.findByIdAndUpdate(
      chatId,
      { $push: { messages: newMessage }, $set: { updatedAt: new Date() } },
      { new: true }
    )
      .populate('participants.user', 'name avatar')
      .populate('messages.sender', 'name avatar')
      .lean();

    const savedMessage = updatedChat.messages.find(
      m => m._id.toString() === newMessage._id.toString()
    );

    io.to(`chat-${chatId}`).emit('newMessage', {
      chatId,
      message: savedMessage,
      sender: savedMessage.sender,
      participants: updatedChat.participants
    });

    updatedChat.participants.forEach(participant => {
      if (!participant.user._id.equals(req.userId)) {
        io.to(`user-${participant.user._id}`).emit('newMessageNotification', {
          chatId,
          senderId: req.userId,
          senderName: savedMessage.sender.name,
          preview: content.length > 30 ? `${content.substring(0, 30)}...` : content,
          timestamp: new Date()
        });
      }
    });

    res.status(201).json({ success: true, data: savedMessage });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

// Optional: Get chat session by ChatRequest ID
export const getChatByRequestId = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: 'Valid request ID is required' });
    }

    const chatSession = await ChatSession.findOne({ request: requestId })
      .populate('participants.user', 'name email avatar')
      .lean();

    if (!chatSession) {
      return res.status(404).json({ success: false, message: 'Chat session not found for this request' });
    }

    res.status(200).json({ success: true, data: { chatSession } });
  } catch (err) {
    console.error('Get chat by request error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch chat session' });
  }
};
