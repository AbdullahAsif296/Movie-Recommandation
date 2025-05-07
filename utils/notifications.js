import User from '../models/userModel.js';

export const notifyUsers = async ({ type, threadId, commentId, userId, mentionedUsers = [] }) => {
  try {
    // Get users to notify
    const usersToNotify = new Set(mentionedUsers);

    // Add thread author for comments
    if (type === 'NEW_COMMENT' && threadId) {
      const thread = await Thread.findById(threadId).select('author');
      if (thread && thread.author.toString() !== userId.toString()) {
        usersToNotify.add(thread.author);
      }
    }

    // Remove the user who triggered the notification
    usersToNotify.delete(userId);

    // Create notification data
    const notification = {
      type,
      from: userId,
      thread: threadId,
      comment: commentId,
      createdAt: new Date()
    };

    // Add notification to each user's notifications array
    if (usersToNotify.size > 0) {
      await User.updateMany(
        { _id: { $in: Array.from(usersToNotify) } },
        { 
          $push: { 
            notifications: {
              $each: [notification],
              $position: 0,
              $slice: 50 // Keep only last 50 notifications
            }
          }
        }
      );
    }

    // Could add real-time notifications here using WebSocket/Socket.io
    // socketIO.to(Array.from(usersToNotify)).emit('notification', notification);

  } catch (error) {
    console.error('Notification error:', error);
    // Don't throw error as notifications are not critical
  }
};

// Helper function to format notifications
export const formatNotification = (notification) => {
  const { type, from, thread, comment } = notification;
  
  switch (type) {
    case 'NEW_COMMENT':
      return {
        message: 'commented on your thread',
        link: `/threads/${thread}#comment-${comment}`
      };
    case 'MENTION':
      return {
        message: 'mentioned you in a comment',
        link: `/threads/${thread}#comment-${comment}`
      };
    case 'LIKE':
      return {
        message: 'liked your thread',
        link: `/threads/${thread}`
      };
    default:
      return {
        message: 'interacted with your content',
        link: `/threads/${thread}`
      };
  }
};

// Get user notifications
export const getUserNotifications = async (userId, page = 1, limit = 20) => {
  const user = await User.findById(userId)
    .select('notifications')
    .populate('notifications.from', 'name avatar')
    .populate('notifications.thread', 'title');

  const start = (page - 1) * limit;
  const end = start + limit;
  const notifications = user.notifications.slice(start, end);

  return {
    notifications: notifications.map(n => ({
      ...n.toObject(),
      ...formatNotification(n)
    })),
    total: user.notifications.length,
    page: Number(page),
    totalPages: Math.ceil(user.notifications.length / limit)
  };
};

// Mark notifications as read
export const markNotificationsAsRead = async (userId, notificationIds = []) => {
  const update = notificationIds.length 
    ? { 'notifications.$[elem].read': true }
    : { 'notifications.$[].read': true };

  const options = notificationIds.length 
    ? { arrayFilters: [{ 'elem._id': { $in: notificationIds } }] }
    : {};

  await User.updateOne(
    { _id: userId },
    update,
    options
  );
}; 