import Notification from '../models/Notification.js';
import ChatRequest from '../models/ChatRequest.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.userId,
      read: false
    })
    .populate({
      path: 'relatedRequest',
      populate: {
        path: 'helper',
        select: 'user',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      }
    })
    .populate({
      path: 'relatedChat',
      select: '_id status' // Only include necessary fields
    })
    .sort({ createdAt: -1 })
    .lean();

    // Transform notifications to include chatId in consistent location
    const transformedNotifications = notifications.map(notification => {
      const chatId = 
        notification.relatedChat?._id ||
        notification.metadata?.chatId;
      
      return {
        ...notification,
        chatId // Add chatId at root level for easy access
      };
    });

    res.status(200).json({
      success: true,
      data: transformedNotifications
    });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (err) {
    console.error('Mark notification read error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update notification'
    });
  }
};