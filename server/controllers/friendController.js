import Friend from '../models/Friend.js';
import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const search = req.query.search || '';

    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ],
    });

    const sentRequests = await Friend.find({ requester: currentUserId }).lean();
    const receivedRequests = await Friend.find({ recipient: currentUserId }).lean();
    const friends = await Friend.find({
      $or: [
        { requester: currentUserId },
        { recipient: currentUserId }
      ],
      status: 'accepted'
    }).lean();

    const combinedStatus = {};

    sentRequests.forEach(req => {
      combinedStatus[req.recipient.toString()] = 'pending';
    });
    receivedRequests.forEach(req => {
      if (req.status === 'pending') {
        combinedStatus[req.requester.toString()] = 'incoming';
      }
    });
    friends.forEach(f => {
      const otherId = f.requester.toString() === currentUserId ? f.recipient.toString() : f.requester.toString();
      combinedStatus[otherId] = 'accepted';
    });

    const result = users.map(user => ({
      ...user._doc,
      status: combinedStatus[user._id.toString()] || 'none',
      initials: user.name ? user.name.charAt(0) + (user.username?.charAt(0) || '') : ''
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

export const sendFriendRequest = async (req, res) => {
  const currentUserId = req.user.id;
  const recipientId = req.params.userId;

  try {
    const exists = await Friend.findOne({
      $or: [
        { requester: currentUserId, recipient: recipientId },
        { requester: recipientId, recipient: currentUserId }
      ]
    });

    if (exists) return res.status(400).json({ message: 'Request already exists' });

    const newRequest = await Friend.create({
      requester: currentUserId,
      recipient: recipientId,
    });

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send request', error: err.message });
  }
};

export const getFriendRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const incoming = await Friend.find({ recipient: userId, status: 'pending' }).populate('requester', 'name username');
    const outgoing = await Friend.find({ requester: userId, status: 'pending' }).populate('recipient', 'name username');

    res.json({ incoming, outgoing });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get requests', error: err.message });
  }
};

export const handleRequest = async (req, res) => {
  const requestId = req.params.requestId;
  const { action } = req.body;

  try {
    const request = await Friend.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (action === 'accept') {
      request.status = 'accepted';
      // Update both users' friends arrays
      await User.findByIdAndUpdate(request.requester, {
        $addToSet: { friends: request.recipient }
      });
      await User.findByIdAndUpdate(request.recipient, {
        $addToSet: { friends: request.requester }
      });
    } else if (action === 'reject') {
      request.status = 'rejected';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await request.save();
    res.json({ message: `Request ${action}ed successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update request', error: err.message });
  }
};

export const cancelRequest = async (req, res) => {
  const requestId = req.params.requestId;

  try {
    await Friend.findByIdAndDelete(requestId);
    res.json({ message: 'Request canceled' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel request', error: err.message });
  }
};

export const getFriends = async (req, res) => {
  const userId = req.user.id;

  try {
    const friends = await Friend.find({
      $or: [
        { requester: userId },
        { recipient: userId }
      ],
      status: 'accepted'
    }).populate('requester recipient', 'name username');

    const result = friends.map(f => {
      const friend = f.requester._id.toString() === userId ? f.recipient : f.requester;
      return {
        _id: friend._id,
        name: friend.name,
        username: friend.username,
        initials: friend.name.charAt(0) + (friend.username?.charAt(0) || ''),
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch friends', error: err.message });
  }
};

export const removeFriend = async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.friendId;

  try {
    const friendship = await Friend.findOneAndDelete({
      $or: [
        { requester: userId, recipient: friendId },
        { requester: friendId, recipient: userId }
      ],
      status: 'accepted'
    });

    if (!friendship) return res.status(404).json({ message: 'Friendship not found' });

    // Remove from both users' friends arrays
    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId }
    });
    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: userId }
    });

    res.json({ message: 'Friend removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove friend', error: err.message });
  }
};
