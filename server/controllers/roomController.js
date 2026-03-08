import Room from '../models/Room.js';
import User from '../models/User.js';

import Friend from '../models/Friend.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

// @desc    Get all rooms for user
// @route   GET /api/rooms
// @access  Private
const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ userId: req.user.id });
  
  if (rooms.length === 0) {
    const defaultRooms = [
      { userId: req.user.id, roomId: 'music', isPublic: true },
      { userId: req.user.id, roomId: 'cinema', isPublic: true },
      { userId: req.user.id, roomId: 'poetry', isPublic: false },
      { userId: req.user.id, roomId: 'library', isPublic: true },
      { userId: req.user.id, roomId: 'release', isPublic: false },
      { userId: req.user.id, roomId: 'diary', isPublic: true }
    ];
    
    const createdRooms = await Room.insertMany(defaultRooms);
    return res.status(200).json(createdRooms);
  }

  res.status(200).json(rooms);
});

// @desc    Update room privacy
// @route   PUT /api/rooms/:roomId
// @access  Private
const updateRoomPrivacy = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { isPublic } = req.body;

  const room = await Room.findOneAndUpdate(
    { userId: req.user.id, roomId },
    { isPublic },
    { new: true, upsert: true }
  );

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  res.status(200).json({
    _id: room._id,
    roomId: room.roomId,
    isPublic: room.isPublic,
    userId: room.userId
  });
});

// @desc    Get friend's public rooms (with friendship verification)
// @route   GET /api/rooms/friends/:friendId/rooms
// @access  Private

const getFriendPublicRooms = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.friendId)) {
    res.status(400);
    throw new Error('Invalid friend ID format');
  }

  const friendId = new mongoose.Types.ObjectId(req.params.friendId);

  const friendshipExists = await Friend.findOne({
    $or: [
      { requester: req.user.id, recipient: friendId, status: 'accepted' },
      { requester: friendId, recipient: req.user.id, status: 'accepted' }
    ]
  });

  if (!friendshipExists) {
    res.status(403).json({
      success: false,
      message: 'Not authorized to view this content. You must be friends first.'
    });
    return;
  }

  const rooms = await Room.find({ 
    userId: friendId,
    isPublic: true 
  }).select('roomId isPublic -_id');

  res.status(200).json({
    success: true,
    data: rooms
  });
});


export {
  getRooms,
  updateRoomPrivacy,
  getFriendPublicRooms
};