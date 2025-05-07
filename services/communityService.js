import { Thread, Comment } from '../models/communityModel.js';
import { NotFoundError, UnauthorizedError } from '../utils/errors.js';
import { notifyUsers } from '../utils/notifications.js';

class CommunityService {
  // Thread methods
  async createThread(threadData, userId) {
    const thread = new Thread({
      ...threadData,
      author: userId,
      relatedModel: threadData.category === 'GENERAL' ? undefined : threadData.category
    });
    await thread.save();
    return thread.populate(['author', 'relatedTo']);
  }

  async getThreads(filters = {}, page = 1, limit = 20) {
    const query = { ...filters };
    const skip = (page - 1) * limit;

    const [threads, total] = await Promise.all([
      Thread.find(query)
        .sort({ isPinned: -1, lastActivity: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name')
        .populate('relatedTo'),
      Thread.countDocuments(query)
    ]);

    return {
      threads,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    };
  }

  async getThread(threadId) {
    const thread = await Thread.findByIdAndUpdate(
      threadId,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name')
      .populate('relatedTo')
      .populate('likes', 'name');

    if (!thread) {
      throw new NotFoundError('Thread not found');
    }

    return thread;
  }

  async searchThreads(searchTerm, filters = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const query = {
      ...filters,
      $text: { $search: searchTerm }
    };

    const [threads, total] = await Promise.all([
      Thread.find(query)
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name'),
      Thread.countDocuments(query)
    ]);

    return {
      threads,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    };
  }

  // Comment methods
  async addComment(threadId, commentData, userId) {
    const thread = await Thread.findById(threadId);
    if (!thread) {
      throw new NotFoundError('Thread not found');
    }

    if (thread.isLocked) {
      throw new UnauthorizedError('Thread is locked');
    }

    const comment = new Comment({
      thread: threadId,
      content: commentData.content,
      author: userId,
      parentComment: commentData.parentComment
    });

    await comment.save();
    thread.lastActivity = new Date();
    await thread.save();

    // Notify thread author and mentioned users
    await notifyUsers({
      type: 'NEW_COMMENT',
      threadId,
      commentId: comment._id,
      userId,
      mentionedUsers: commentData.mentions
    });

    return comment.populate(['author', 'parentComment']);
  }

  async getComments(threadId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ thread: threadId })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name')
        .populate('parentComment'),
      Comment.countDocuments({ thread: threadId })
    ]);

    return {
      comments,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    };
  }

  // Engagement methods
  async toggleLike(threadId, userId) {
    const thread = await Thread.findById(threadId);
    if (!thread) {
      throw new NotFoundError('Thread not found');
    }

    const likeIndex = thread.likes.indexOf(userId);
    if (likeIndex === -1) {
      thread.likes.push(userId);
    } else {
      thread.likes.splice(likeIndex, 1);
    }

    await thread.save();
    return thread;
  }

  async reportContent(contentType, contentId, userId, reason) {
    const Model = contentType === 'thread' ? Thread : Comment;
    const content = await Model.findById(contentId);
    
    if (!content) {
      throw new NotFoundError(`${contentType} not found`);
    }

    content.reports.push({
      user: userId,
      reason,
      createdAt: new Date()
    });

    await content.save();
    return content;
  }

  // Moderation methods
  async moderateContent(contentType, contentId, action, moderatorId) {
    const Model = contentType === 'thread' ? Thread : Comment;
    const content = await Model.findById(contentId);
    
    if (!content) {
      throw new NotFoundError(`${contentType} not found`);
    }

    switch (action) {
      case 'DELETE':
        await Model.deleteOne({ _id: contentId });
        return { message: `${contentType} deleted successfully` };
      case 'LOCK':
        if (contentType !== 'thread') {
          throw new Error('Only threads can be locked');
        }
        content.isLocked = !content.isLocked;
        await content.save();
        return content;
      default:
        throw new Error('Invalid moderation action');
    }
  }
}

export default new CommunityService(); 