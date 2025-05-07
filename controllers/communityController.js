import CommunityService from '../services/communityService.js';

export const createThread = async (req, res) => {
  try {
    const thread = await CommunityService.createThread(req.body, req.user.id);
    res.status(201).json(thread);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getThreads = async (req, res) => {
  try {
    const { category, page, limit } = req.query;
    const filters = category ? { category } : {};
    const threads = await CommunityService.getThreads(filters, page, limit);
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getThread = async (req, res) => {
  try {
    const thread = await CommunityService.getThread(req.params.threadId);
    res.json(thread);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const comment = await CommunityService.addComment(
      req.params.threadId,
      req.body,
      req.user.id
    );
    res.status(201).json(comment);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const comments = await CommunityService.getComments(
      req.params.threadId,
      page,
      limit
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const thread = await CommunityService.toggleLike(
      req.params.threadId,
      req.user.id
    );
    res.json(thread);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const reportContent = async (req, res) => {
  try {
    const { contentType } = req.params;
    const content = await CommunityService.reportContent(
      contentType,
      req.params.contentId,
      req.user.id,
      req.body.reason
    );
    res.json(content);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const moderateContent = async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const { action } = req.body;
    const result = await CommunityService.moderateContent(
      contentType,
      contentId,
      action,
      req.user.id
    );
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const searchThreads = async (req, res) => {
  try {
    const { searchTerm, category, page, limit } = req.query;
    const filters = category ? { category } : {};
    const results = await CommunityService.searchThreads(
      searchTerm,
      filters,
      page,
      limit
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... other controller methods ... 